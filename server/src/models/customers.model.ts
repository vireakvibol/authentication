import { UUIDV4 } from 'sequelize';
import { Column, Model, Table } from 'sequelize-typescript';
import { Optional } from 'sequelize';

interface Customer {
  readonly id: string;
  readonly tel: string;
  readonly password: string;
  readonly active: boolean;
}
type CustomerOptional = Optional<Customer, 'id' | 'active'>;

@Table({
  tableName: 'customers',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class CustomersModel extends Model<Customer, CustomerOptional> {
  @Column({ primaryKey: true, defaultValue: UUIDV4 })
  readonly id: string;

  @Column({ unique: true, allowNull: false })
  readonly tel: string;

  @Column({ allowNull: false })
  readonly password: string;

  @Column({ unique: true, allowNull: false, defaultValue: true })
  readonly active: boolean;
}
