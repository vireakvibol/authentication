import { UUIDV4 } from 'sequelize';
import { Column, Model, Table } from 'sequelize-typescript';
import { Optional } from 'sequelize';

interface Group {
  readonly id: string;
  readonly name: string;
}
type GroupOptional = Optional<Group, 'id'>;

@Table({
  tableName: 'user_groups',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class UserGroupsModel extends Model<Group, GroupOptional> {
  @Column({ primaryKey: true, defaultValue: UUIDV4 })
  readonly id: string;

  @Column({ unique: true, allowNull: false })
  readonly name: string;
}
