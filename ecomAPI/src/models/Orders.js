'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Orders extends Model {
    static associate(models) {
      Orders.belongsTo(models.Customer, { foreignKey: 'customerId' });
      Orders.belongsTo(models.ShippingAddress, { foreignKey: 'shippingAddressId' });
      Orders.belongsTo(models.Voucher, { foreignKey: 'voucherId' });
      Orders.hasMany(models.OrderDetail, { foreignKey: 'orderId' });
    }
  }
  Orders.init({
    orderId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'order_id' },
    customerId: { type: DataTypes.INTEGER, allowNull: false, field: 'customer_id' },
    shippingAddressId: { type: DataTypes.INTEGER, allowNull: false, field: 'shipping_address_id' },
    voucherId: { type: DataTypes.INTEGER, allowNull: true, field: 'voucher_id' },
    orderDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'order_date' },
    status: { type: DataTypes.STRING(50), allowNull: false, defaultValue: 'pending' },
    totalAmount: { type: DataTypes.DECIMAL(15, 2), allowNull: false, field: 'total_amount' },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'updated_at' }
  }, {
    sequelize,
    modelName: 'Orders',
    tableName: 'orders',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Orders;
};
