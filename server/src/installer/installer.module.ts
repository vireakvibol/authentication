import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { OptionsModel } from 'src/models/options.model';
import { UsersModel } from 'src/models/users.model';
import { UserGroupsModel } from 'src/models/user_groups.model';
import { InstallerController } from './installer.controller';
import { InstallerService } from './installer.service';

@Module({
  imports: [
    SequelizeModule.forFeature([UsersModel, UserGroupsModel, OptionsModel]),
  ],
  controllers: [InstallerController],
  providers: [InstallerService],
})
export class InstallerModule {}
