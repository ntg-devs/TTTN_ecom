'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Conversation extends Model {
    static associate(models) {
      Conversation.belongsTo(models.Customer, { foreignKey: 'customerId' });
      Conversation.belongsTo(models.Employee, { foreignKey: 'employeeId' });
    }
  }

  Conversation.init({
    conversationId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'conversation_id' },
    customerId: { type: DataTypes.INTEGER, allowNull: false, field: 'customer_id' },
    employeeId: { type: DataTypes.INTEGER, allowNull: false, field: 'employee_id' },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'updated_at' }
  }, {
    sequelize,
    modelName: 'Conversation',
    tableName: 'conversation',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Conversation;
};
