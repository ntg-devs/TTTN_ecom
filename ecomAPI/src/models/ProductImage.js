"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ProductImage extends Model {
    static associate(models) {
      ProductImage.belongsTo(models.Product, { foreignKey: "productId" });
    }
  }

  ProductImage.init(
    {
      imageId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "image_id",
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "product_id",
      },
      image: {
        type: DataTypes.BLOB("long"), // thay cho LONGBLOB
        allowNull: true,
        field: "image",
      },
      description: { type: DataTypes.TEXT, allowNull: true },
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
      modelName: "ProductImage",
      tableName: "product_image",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return ProductImage;
};
