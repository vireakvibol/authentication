import { Injectable } from '@nestjs/common';
import { createHmac } from 'crypto';
import { genSaltSync, hashSync } from 'bcrypt';
import { Sequelize } from 'sequelize-typescript';
import { UsersModel } from 'src/users/users.model';
import { UserGroupsModel } from 'src/users/groups/groups.model';
import { InjectModel } from '@nestjs/sequelize';
import { OptionsModel } from 'src/options/options.model';

@Injectable()
export class InstallerService {
  constructor(
    private sequelize: Sequelize,
    @InjectModel(UsersModel) private usersModel: typeof UsersModel,
    @InjectModel(UserGroupsModel)
    private userGroupsModel: typeof UserGroupsModel,
    @InjectModel(OptionsModel) private optionsModel: typeof OptionsModel,
  ) {}

  async isInstalled(): Promise<boolean> {
    try {
      // find if administrator user exists
      const users = await this.usersModel.findAll({
        include: [
          {
            model: this.userGroupsModel,
            where: {
              name: 'Administrator',
            },
          },
        ],
      });

      // if administrator user exists return true
      if (users.length > 0) {
        return true;
      }
    } catch (error) {
      console.trace(error);
      return false;
    }
  }

  async install(
    email: string,
    password: string,
    firebase: string,
    privateKey: string,
  ): Promise<boolean> {
    let hashed: string;

    try {
      /**
       * start hashing password with bcrypt see
       * see: https://nodejs.org/api/crypto.html#crypto for sha256 hash
       * see: https://www.npmjs.com/package/bcrypt for bcrypt hash
       */
      const passwordsha256: string = await createHmac(
        'sha256',
        password,
      ).digest('hex'); // hash password to sha256
      const salt: string = await genSaltSync(Math.floor(Math.random() * 5) + 5); // generate bcrypt salt

      hashed = await hashSync(passwordsha256, salt); // hash password with salt
    } catch (error) {
      console.log(error);
      return false;
    }

    try {
      /**
       * Transaction
       * see: https://docs.nestjs.com/techniques/database#transactions-1
       */
      await this.sequelize.transaction(async (transaction): Promise<void> => {
        // create administrator group
        const group: UserGroupsModel = await this.userGroupsModel.create(
          {
            name: 'Administrator',
          },
          { transaction },
        );

        // create administrator user
        await this.usersModel.create<UsersModel>(
          {
            email,
            password: hashed,
            primary: true,
            user_group_id: group.id,
          },
          { transaction },
        );

        // create firebase Admin SDK as option
        await this.optionsModel.bulkCreate(
          [
            {
              name: 'firebase',
              value: firebase,
            },
            {
              name: 'privateKey',
              value: privateKey,
            },
          ],
          { transaction },
        );
      });

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async getInstallerHtml(): Promise<string> {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js" integrity="sha384-vtXRMe3mGCbOeY7l30aIg8H9p3GdeSe4IFlP6G8JMa7o7lXvnz3GFKzPxzJdPfGK" crossorigin="anonymous"></script>
      <script></script>
      <script>
      jQuery(function ($) {
        $('#form').submit(function (e) {
    
          const email = $('#email').val();
          const password = $('#password').val();
          const repass = $('#repass').val();
          const firebase = $('#firebase').val();
          const privateKey = $('#privateKey').val();
          
          if (email === '' || password === '' || repass === '' || firebase === '' || privateKey === '') {
            alert('Please enter all fields!');
            e.preventDefault();
          }
    
          if (password !== repass) {
            alert('Password doesn\\'t match');
            e.preventDefault();
          }
    
          $.ajax({
            method: 'PUT',
            url: '/installer',
            data: { email, password, firebase, privateKey },
            success: function (data) {
              window.location.href = '/';
              console.log(data);
            },
            error: function (err) {
              alert('Error! Something went wrong...');
              console.log(err)
            }
          })
          
          e.preventDefault();
        });
      });
      </script>
      <title>Document</title>
    </head>
    <body style="position: fixed; display: flex; width: 100%; height: 100%; justify-content: center; align-items: center;">
      <div style="width: 30rem;">
    
        <div class="card" style="">
          <div class="card-body">
            <h5 class="card-title">Initial Installation</h5>
            <p class="card-text">
              <form id="form">
    
                <hr />
                <span style="font-weight: bold;">Create administrator account</span>
                <div class="mb-3">
                  <label for="email" class="form-label">Email address</label>
                  <input id="email" value="" type="email" class="form-control" />
                </div>
                <div class="mb-3">
                  <label for="password" class="form-label">Choose password</label>
                  <input id="password" value="" type="password" class="form-control" />
                </div>
                <div class="mb-3">
                  <label for="repass" class="form-label">Confirm password</label>
                  <input id="repass" value="" type="password" class="form-control" />
                </div>
    
                <hr />
                <span style="font-weight: bold;">App key and third party key</span>
                <div class="mb-3">
                  <label for="privateKey" class="form-label">OpenSSL Private Key</label>
                  <textarea id="privateKey" rows="5" class="form-control"></textarea>
                </div>
                <div class="mb-3">
                  <label for="firebase" class="form-label">Firebase Admin SDK</label>
                  <textarea id="firebase" rows="5" class="form-control"></textarea>
                </div>
    
                <hr />
                <div class="mb-3">
                  <button type="submit" class="btn btn-primary">Procceed installing</button>
                </div>
              </form>
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
    `;
  }
}
