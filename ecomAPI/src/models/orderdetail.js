'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OrderDetail extends Model {
    static associate(models) {
      OrderDetail.belongsTo(models.Orders, { foreignKey: 'orderId' });
      OrderDetail.belongsTo(models.ProductSize, { foreignKey: 'productSizeId' });
      OrderDetail.belongsTo(models.AffiliateLink, { foreignKey: 'affiliateLinkId' });
    }
  }

  OrderDetail.init({
    orderDetailId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'order_detail_id' },
    orderId: { type: DataTypes.INTEGER, allowNull: false, field: 'order_id' },
    productSizeId: { type: DataTypes.INTEGER, allowNull: false, field: 'product_size_id' },
    affiliateLinkId: { type: DataTypes.INTEGER, allowNull: true, field: 'affiliate_link_id' },
    quantity: { 
      type: DataTypes.INTEGER, 
      allowNull: false, 
      validate: { min: 1 } 
    },
    price: { 
      type: DataTypes.DECIMAL(10, 2), 
      allowNull: false, 
      validate: { min: 0 } 
    },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'updated_at' }
  }, {
    sequelize,
    modelName: 'OrderDetail',
    tableName: 'order_detail',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return OrderDetail;
};
