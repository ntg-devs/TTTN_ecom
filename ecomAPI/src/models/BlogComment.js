'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BlogComment extends Model {
    static associate(models) {
      BlogComment.belongsTo(models.Customer, { foreignKey: 'customerId' });
      BlogComment.belongsTo(models.Blog, { foreignKey: 'blogId' });
    }
  }

  BlogComment.init({
    commentId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'comment_id' },
    customerId: { type: DataTypes.INTEGER, allowNull: false, field: 'customer_id' },
    blogId: { type: DataTypes.INTEGER, allowNull: false, field: 'blog_id' },
    content: { type: DataTypes.TEXT, allowNull: false },
    commentDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'comment_date' },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'updated_at' }
  }, {
    sequelize,
    modelName: 'BlogComment',
    tableName: 'blog_comment',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return BlogComment;
};
