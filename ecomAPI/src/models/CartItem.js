'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CartItem extends Model {
    static associate(models) {
      CartItem.belongsTo(models.Cart, { foreignKey: 'cartId' });
      CartItem.belongsTo(models.ProductSize, { foreignKey: 'productSizeId' });
    }
  }

  CartItem.init({
    cartItemId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'cart_item_id' },
    cartId: { type: DataTypes.INTEGER, allowNull: false, field: 'cart_id' },
    productSizeId: { type: DataTypes.INTEGER, allowNull: false, field: 'product_size_id' },
    quantity: { 
      type: DataTypes.INTEGER, 
      allowNull: false, 
      validate: { min: 1 } 
    },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'updated_at' }
  }, {
    sequelize,
    modelName: 'CartItem',
    tableName: 'cart_item',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return CartItem;
};
