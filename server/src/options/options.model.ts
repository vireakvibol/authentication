import { Column, Model, Table } from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { UUIDV4 } from 'sequelize';

interface Option {
  readonly id: string;
  readonly name: string;
  readonly value: string;
}

type OptionOptional = Optional<Option, 'id'>;

@Table({
  tableName: 'options',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class OptionsModel extends Model<Option, OptionOptional> {
  @Column({ primaryKey: true, defaultValue: UUIDV4 })
  readonly id: string;

  @Column({ allowNull: false, unique: true })
  readonly name: string;

  @Column({ allowNull: false })
  readonly value: string;
}
