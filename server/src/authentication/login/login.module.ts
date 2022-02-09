import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { OptionsModel } from 'src/models/options.model';
import { UsersModel } from 'src/models/users.model';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';

@Module({
  controllers: [LoginController],
  imports: [SequelizeModule.forFeature([OptionsModel, UsersModel])],
  providers: [LoginService],
})
export class LoginModule {}
