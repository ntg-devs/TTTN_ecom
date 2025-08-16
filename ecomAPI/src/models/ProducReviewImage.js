"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ProductReviewImage extends Model {
    static associate(models) {
      ProductReviewImage.belongsTo(models.ProductReview, {
        foreignKey: "reviewId",
      });
    }
  }
  ProductReviewImage.init(
    {
      imageId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "image_id",
      },
      reviewId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "review_id",
      },
      image: {
        type: DataTypes.BLOB("long"), // thay cho LONGBLOB
        allowNull: true,
        field: "image",
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: "created_at",
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: "updated_at",
      },
    },
    {
      sequelize,
      modelName: "ProductReviewImage",
      tableName: "product_review_image",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return ProductReviewImage;
};
