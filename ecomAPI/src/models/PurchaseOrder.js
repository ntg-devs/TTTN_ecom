'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PurchaseOrder extends Model {
    static associate(models) {
      PurchaseOrder.belongsTo(models.Supplier, { foreignKey: 'supplierId' });
      PurchaseOrder.belongsTo(models.Employee, { foreignKey: 'employeeId' });
      PurchaseOrder.hasMany(models.PurchaseOrderDetail, { foreignKey: 'purchaseOrderId' });
    }
  }

  PurchaseOrder.init({
    purchaseOrderId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'purchase_order_id' },
    supplierId: { type: DataTypes.INTEGER, allowNull: false, field: 'supplier_id' },
    employeeId: { type: DataTypes.INTEGER, allowNull: false, field: 'employee_id' },
    orderDate: { type: DataTypes.DATE, allowNull: false, field: 'order_date' },
    totalAmount: { type: DataTypes.DECIMAL(15, 2), allowNull: false, field: 'total_amount' },
    note: { type: DataTypes.TEXT, allowNull: true },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'updated_at' }
  }, {
    sequelize,
    modelName: 'PurchaseOrder',
    tableName: 'purchase_order',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return PurchaseOrder;
};
