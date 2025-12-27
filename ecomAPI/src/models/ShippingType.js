'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ShippingType extends Model {
    static associate(models) {
     
    }
  }

  ShippingType.init({
    shippingTypeId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'shipping_type_id' },
    name: { type: DataTypes.STRING, allowNull: false },
    cost: { type: DataTypes.DECIMAL(10, 2), allowNull: false, validate: { min: 0 } },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'updated_at' }
  }, {
    sequelize,
    modelName: 'ShippingType',
    tableName: 'shipping_type',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return ShippingType;
};
