'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      Category.hasMany(models.Product, { foreignKey: 'categoryId' });
    }
  }
  Category.init({
    categoryId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'category_id' },
    categoryName: { type: DataTypes.STRING, allowNull: false, field: 'category_name' },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'updated_at' }
  }, {
    sequelize,
    modelName: 'Category',
    tableName: 'category',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Category;
};
