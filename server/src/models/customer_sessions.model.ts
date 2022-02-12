import { UUIDV4 } from 'sequelize';
import { BelongsTo, Column, Model, Table } from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { CustomersModel } from './customers.model';

interface CustomerSession {
  readonly id: string;
  readonly expired: boolean;
  readonly customer_id: string;
}
type CustomerSessionOptional = Optional<CustomerSession, 'id' | 'expired'>;

@Table({
  tableName: 'customer_sessions',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class CustomerSessionsModel extends Model<
  CustomerSession,
  CustomerSessionOptional
> {
  @Column({ primaryKey: true, defaultValue: UUIDV4 })
  readonly id: string;

  @Column({ unique: true, allowNull: false, defaultValue: false })
  readonly expired: boolean;

  @BelongsTo(() => CustomersModel, 'customer_id')
  readonly customer?: CustomersModel;
}
