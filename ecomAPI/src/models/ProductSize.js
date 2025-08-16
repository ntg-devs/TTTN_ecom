'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProductSize extends Model {
    static associate(models) {
      ProductSize.belongsTo(models.Product, { foreignKey: 'productId' });
      ProductSize.belongsTo(models.Size, { foreignKey: 'sizeId' });
    }
  }
  ProductSize.init({
    productSizeId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'product_size_id' },
    productId: { type: DataTypes.INTEGER, allowNull: false, field: 'product_id' },
    sizeId: { type: DataTypes.INTEGER, allowNull: false, field: 'size_id' },
    stock: { type: DataTypes.INTEGER, allowNull: false },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'updated_at' }
  }, {
    sequelize,
    modelName: 'ProductSize',
    tableName: 'product_size',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return ProductSize;
};
