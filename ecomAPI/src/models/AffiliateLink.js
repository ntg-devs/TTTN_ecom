'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AffiliateLink extends Model {
    static associate(models) {
      AffiliateLink.belongsTo(models.KolInfo, { foreignKey: 'kolId' });
      AffiliateLink.belongsTo(models.Product, { foreignKey: 'productId' });
    }
  }

  AffiliateLink.init({
    linkId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'link_id' },
    kolId: { type: DataTypes.INTEGER, allowNull: false, field: 'kol_id' },
    productId: { type: DataTypes.INTEGER, allowNull: false, field: 'product_id' },
    originalUrl: { type: DataTypes.STRING, allowNull: false, field: 'original_url' },
    shortUrl: { type: DataTypes.STRING, allowNull: false, field: 'short_url' },
    clicksCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, validate: { min: 0 }, field: 'clicks_count' },
    ordersCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, validate: { min: 0 }, field: 'orders_count' },
    // totalCommission: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0, validate: { min: 0 }, field: 'total_commission' },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'updated_at' }
  }, {
    sequelize,
    modelName: 'AffiliateLink',
    tableName: 'affiliate_link',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return AffiliateLink;
};
