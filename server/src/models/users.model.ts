import { UUIDV4 } from 'sequelize';
import { Optional } from 'sequelize';
import { BelongsTo, Column, Model, Table } from 'sequelize-typescript';
import { UserGroupsModel } from './user_groups.model';

interface User {
  readonly id: string;
  readonly email: string;
  readonly password: string;
  readonly firstname: string;
  readonly lastname: string;
  readonly tel: string;
  readonly activated: boolean;
  readonly primary: boolean;
  readonly user_group_id: string;
}
type UserOptional = Optional<
  User,
  | 'id'
  | 'firstname'
  | 'lastname'
  | 'tel'
  | 'activated'
  | 'primary'
  | 'user_group_id'
>;

@Table({ tableName: 'users', createdAt: 'created_at', updatedAt: 'updated_at' })
export class UsersModel extends Model<User, UserOptional> {
  @Column({ primaryKey: true, defaultValue: UUIDV4 })
  readonly id: string;

  @Column({ unique: true, allowNull: false })
  readonly email: string;

  @Column({ allowNull: false })
  readonly password: string;

  @Column
  readonly firstName: string;

  @Column
  readonly lastName: string;

  @Column({ unique: true })
  readonly tel: string;

  @Column({ allowNull: false, defaultValue: true })
  readonly activated: boolean;

  @Column({ allowNull: false, defaultValue: false })
  readonly primary: boolean;

  @Column({ allowNull: false })
  readonly user_group_id: string;

  @BelongsTo(() => UserGroupsModel, 'user_group_id')
  readonly group?: UserGroupsModel;
}
