"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Blog extends Model {
    static associate(models) {
      Blog.belongsTo(models.Employee, { foreignKey: "employeeId" });
    }
  }

  Blog.init(
    {
      blogId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "blog_id",
      },
      employeeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "employee_id",
      },
      title: { type: DataTypes.STRING, allowNull: false },
      content: { type: DataTypes.TEXT, allowNull: false },
      image: {
        type: DataTypes.BLOB("long"), // thay cho LONGBLOB
        allowNull: true,
        field: "image",
      },
      isPublished: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "is_published",
      },
      publishedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "published_at",
        validate: {
          isAfterCreatedAt(value) {
            if (value && this.createdAt && value < this.createdAt) {
              throw new Error(
                "Published date must be greater than or equal to created date"
              );
            }
          },
        },
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
      modelName: "Blog",
      tableName: "blog",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return Blog;
};
