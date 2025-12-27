'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsTo(models.Category, { foreignKey: 'categoryId' });
      Product.hasMany(models.ProductSize, { foreignKey: 'productId' });
      Product.hasMany(models.AffiliateLink, { foreignKey: 'productId' });
      Product.hasMany(models.ProductImage, { foreignKey: 'productId' });
    }
  }

  Product.init({
    productId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'product_id' },
    categoryId: { type: DataTypes.INTEGER, allowNull: false, field: 'category_id' },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    originalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: { min: 0 },
      field: 'original_price'
    },
    discountPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: { min: 0 },
      field: 'discount_price'
    },
    madeBy: { type: DataTypes.STRING, allowNull: true, field: 'made_by' },
    material: { type: DataTypes.STRING, allowNull: true },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'is_active' },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'updated_at' }
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'product',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Product;
};
