'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Supplier extends Model {
    static associate(models) {
      Supplier.hasMany(models.PurchaseOrder, { foreignKey: 'supplierId' });
    }
  }

  Supplier.init({
    supplierId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'supplier_id' },
    name: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: true },
    email: { type: DataTypes.STRING, allowNull: true },
    phone: { type: DataTypes.STRING, allowNull: true },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'updated_at' }
  }, {
    sequelize,
    modelName: 'Supplier',
    tableName: 'supplier',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Supplier;
};
