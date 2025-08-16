'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    static associate(models) {
      Cart.belongsTo(models.Customer, { foreignKey: 'customerId' });
      Cart.hasMany(models.CartItem, { foreignKey: 'cartId' });
    }
  }
  Cart.init({
    cartId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'cart_id' },
    customerId: { type: DataTypes.INTEGER, allowNull: false, field: 'customer_id' },
    status: { type: DataTypes.ENUM('active', 'checked_out'), defaultValue: 'active' },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'updated_at' }
  }, {
    sequelize,
    modelName: 'Cart',
    tableName: 'cart',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Cart;
};
