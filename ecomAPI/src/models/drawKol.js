"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class drawkol extends Model {
    static associate(models) {
      drawkol.belongsTo(models.User, {
        foreignKey: "kolId",
        targetKey: "id",
        as: "kol",
      });
      drawkol.belongsTo(models.User, {
        foreignKey: "reviewId",
        targetKey: "id",
        as: "reviewedBy",
      });
    }
  }

  drawkol.init(
    {
      kolId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      reviewId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      image_bank: {
        type: DataTypes.BLOB('long'),
        allowNull: true,
      },
      amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "approved", "rejected", "completed"),
        allowNull: false,
        defaultValue: "pending",
      },
      bank_account_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bank_account_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bank_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bank_branch: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      withdrawAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      note: {
        type: DataTypes.STRING, // nếu cần ghi chú thêm
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "drawkol",
      tableName: "drawkols", // đặt tên bảng rõ ràng
      timestamps: true, // tự động tạo createdAt, updatedAt
    }
  );

  return drawkol;
};
