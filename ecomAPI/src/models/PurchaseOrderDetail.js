'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PurchaseOrderDetail extends Model {
    static associate(models) {
      PurchaseOrderDetail.belongsTo(models.PurchaseOrder, { foreignKey: 'purchaseOrderId' });
      PurchaseOrderDetail.belongsTo(models.ProductSize, { foreignKey: 'productSizeId' });
    }
  }

  PurchaseOrderDetail.init({
    purchaseOrderDetailId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'purchase_order_detail_id' },
    purchaseOrderId: { type: DataTypes.INTEGER, allowNull: false, field: 'purchase_order_id' },
    productSizeId: { type: DataTypes.INTEGER, allowNull: false, field: 'product_size_id' },
    quantity: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1 } },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false, validate: { min: 0 }, field: 'price' },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'updated_at' }
  }, {
    sequelize,
    modelName: 'PurchaseOrderDetail',
    tableName: 'purchase_order_detail',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return PurchaseOrderDetail;
};
