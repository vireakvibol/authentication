import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Dialect } from 'sequelize/types';
import { InstallerModule } from './installer/installer.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { production } from '../database/config/database.json';

const { dialect, host, username, password, database } = production;

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: <Dialect>dialect,
      host,
      username,
      password,
      database,
      autoLoadModels: true,
    }),
    InstallerModule,
    AuthenticationModule,
  ],
})
export class AppModule {}
