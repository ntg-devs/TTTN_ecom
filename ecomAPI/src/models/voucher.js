'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Voucher extends Model {
    static associate(models) {
      Voucher.hasOne(models.Orders, { foreignKey: 'voucherId' });
    }
  }

  Voucher.init({
    voucherId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'voucher_id' },
    code: { type: DataTypes.STRING, allowNull: false },
    type: { 
      type: DataTypes.STRING(10), 
      allowNull: false, 
      validate: { isIn: [['percent','amount']] } 
    },
    quantity: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 0 } },
    discountValue: { type: DataTypes.DECIMAL(10,2), allowNull: false, validate: { min: 0 }, field: 'discount_value' },
    minOrderValue: { type: DataTypes.DECIMAL(10,2), defaultValue: 0, validate: { min: 0 }, field: 'min_order_value' },
    maxDiscount: { type: DataTypes.DECIMAL(10,2), defaultValue: 0, validate: { min: 0 }, field: 'max_discount' },
    startDate: { type: DataTypes.DATE, allowNull: false, field: 'start_date' },
    endDate: { type: DataTypes.DATE, allowNull: false, field: 'end_date' },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'updated_at' }
  }, {
    sequelize,
    modelName: 'Voucher',
    tableName: 'voucher',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Voucher;
};
