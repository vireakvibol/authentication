import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { OptionsModel } from 'src/options/options.model';
import { UserGroupsModel } from 'src/users/groups/groups.model';
import { UsersModel } from 'src/users/users.model';
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
