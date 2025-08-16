'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProductReview extends Model {
    static associate(models) {
      ProductReview.belongsTo(models.Product, { foreignKey: 'productId' });
      ProductReview.belongsTo(models.Customer, { foreignKey: 'customerId' });
      ProductReview.hasMany(models.ProductReviewImage, { foreignKey: 'reviewId' });
    }
  }
  ProductReview.init({
    reviewId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'review_id' },
    productId: { type: DataTypes.INTEGER, allowNull: false, field: 'product_id' },
    customerId: { type: DataTypes.INTEGER, allowNull: false, field: 'customer_id' },
    rating: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
    comment: { type: DataTypes.TEXT },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'updated_at' }
  }, {
    sequelize,
    modelName: 'ProductReview',
    tableName: 'product_review',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return ProductReview;
};
