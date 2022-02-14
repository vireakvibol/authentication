import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { compareSync } from 'bcrypt';
import { createHmac } from 'crypto';
import { UsersModel } from 'src/models/users.model';

@Injectable()
export class LoginService {
  constructor(
    @InjectModel(UsersModel) private readonly usersModel: typeof UsersModel,
  ) {}

  async authenticate(
    tel: string,
    password: string,
  ): Promise<{ status: number; message: string }> {
    let token: string, usersModel: UsersModel;

    try {
      usersModel = await this.usersModel.findOne({ where: { tel } });
      if (usersModel === null) {
        return {
          status: 403,
          message: 'user not found',
        };
      }
    } catch (error) {
      throw new Error(error);
    }

    // Compare and validate password
    try {
      const passwordSHA256 = createHmac('sha256', password).digest('hex');
      if (!compareSync(passwordSHA256, usersModel.password)) {
        return { status: 500, message: '' };
      }
    } catch (error) {
      console.trace(error);
      return { status: 500, message: '' };
    }

    return { status: 200, message: token };
  }

  private async firebaseAuthenticate(tel: string): Promise<boolean> {
    console.log(tel);
    return true;
  }
}
