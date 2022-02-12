import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CustomersModel } from 'src/models/customers.model';
import { CustomerSessionsModel } from 'src/models/customer_sessions.model';
import { OptionsModel } from 'src/models/options.model';
import { RegisterController } from './register.controller';
import { RegisterService } from './register.service';

@Module({
  controllers: [RegisterController],
  providers: [RegisterService],
  imports: [
    SequelizeModule.forFeature([
      CustomersModel,
      CustomerSessionsModel,
      OptionsModel,
    ]),
  ],
})
export class RegisterModule {}
