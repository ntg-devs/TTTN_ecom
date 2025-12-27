'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Size extends Model {
    static associate(models) {
      Size.hasMany(models.ProductSize, { foreignKey: 'sizeId' });
    }
  }

  Size.init({
    sizeId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'size_id' },
    name: { type: DataTypes.STRING, allowNull: false },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'updated_at' }
  }, {
    sequelize,
    modelName: 'Size',
    tableName: 'size',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Size;
};
