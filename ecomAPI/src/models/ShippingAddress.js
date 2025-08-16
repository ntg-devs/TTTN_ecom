'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ShippingAddress extends Model {
    static associate(models) {
      ShippingAddress.belongsTo(models.Customer, { foreignKey: 'customerId' });
    }
  }

  ShippingAddress.init({
    addressId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, field: 'address_id' },
    customerId: { type: DataTypes.INTEGER, allowNull: false, field: 'customer_id' },
    receiverName: { type: DataTypes.STRING, allowNull: false, field: 'receiver_name' },
    receiverPhone: { type: DataTypes.STRING, allowNull: false, field: 'receiver_phone' },
    addressText: { type: DataTypes.STRING, allowNull: false, field: 'address_text' },
    isDefault: { type: DataTypes.BOOLEAN, allowNull: false, field: 'is_default' },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'updated_at' }
  }, {
    sequelize,
    modelName: 'ShippingAddress',
    tableName: 'shipping_address',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return ShippingAddress;
};
