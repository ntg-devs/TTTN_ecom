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
  }, {
    sequelize,
    modelName: 'Cart',
    tableName: 'cart',
    timestamps: false,

  });
  return Cart;
};
