import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { genSaltSync, hashSync } from 'bcrypt';
import { createHmac } from 'crypto';
import { Sequelize } from 'sequelize-typescript';
import { CustomersModel } from 'src/models/customers.model';
import { CustomerSessionsModel } from 'src/models/customer_sessions.model';
import { OptionsModel } from 'src/models/options.model';
import { sign } from 'jsonwebtoken';

@Injectable()
export class RegisterService {
  constructor(
    private sequelize: Sequelize,
    @InjectModel(CustomersModel)
    private readonly customersModel: typeof CustomersModel,
    @InjectModel(CustomerSessionsModel)
    private readonly customerSessionsModel: typeof CustomerSessionsModel,
    @InjectModel(OptionsModel)
    private readonly optionsModel: typeof OptionsModel,
  ) {}

  async findByTel(tel: string): Promise<void> {
    try {
      const customersModel: CustomersModel = await this.customersModel.findOne({
        where: {
          tel,
        },
      });
      if (customersModel === null) {
        return null;
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async register(tel: string, password: string): Promise<string> {
    let hashed: string;
    let token: string;
    let session_id: string;

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

      hashed = hashSync(passwordsha256, salt); // hash password with salt
    } catch (error) {
      throw new Error(error);
    }

    try {
      /**
       * Transaction
       * see: https://docs.nestjs.com/techniques/database#transactions-1
       */
      await this.sequelize.transaction(async (transaction) => {
        const customersModel: CustomersModel = await this.customersModel.create(
          {
            tel,
            password: hashed,
          },
          { transaction },
        );

        const customerSessionsModel: CustomerSessionsModel =
          await this.customerSessionsModel.create(
            {
              customer_id: customersModel.id,
            },
            { transaction },
          );

        session_id = customerSessionsModel.id;
      });
    } catch (error) {
      throw new Error(error);
    }

    try {
      /**
       * Import OpenSSL private key from database
       * encode payload with private key to json web token (JWT)
       * see: https://github.com/auth0/node-jsonwebtoken for json web token (JWT)
       */
      const optionsModel: OptionsModel = await this.optionsModel.findOne({
        where: {
          name: 'privateKey',
        },
      });

      if (optionsModel === null) {
        throw new Error(null);
      }

      token = sign(
        {
          tel,
          token: session_id,
        },
        optionsModel.value,
        {
          algorithm: 'RS256',
        },
      );
    } catch (error) {
      throw new Error(error);
    }

    return token;
  }
}
