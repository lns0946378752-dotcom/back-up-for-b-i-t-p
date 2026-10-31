import {
  DataTypes,
  Model,
  type InferAttributes,
  type InferCreationAttributes,
} from 'sequelize';
import { sequelize } from '../config/database.js';

/**
 * Model Sequelize ánh xạ bảng dbo.Lop trong cơ sở dữ liệu SQL Server.
 */
export class Lop extends Model<
  InferAttributes<Lop>,
  InferCreationAttributes<Lop>
> {
  declare maLop: string;
  declare tenLop: string;
}

Lop.init(
  {
    maLop: {
      type: DataTypes.STRING(50),
      primaryKey: true,
      allowNull: false,
    },
    tenLop: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'Lop',
    schema: 'dbo',
    timestamps: false,
  }
);
