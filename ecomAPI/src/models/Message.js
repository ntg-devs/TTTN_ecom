'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      Message.belongsTo(models.Conversation, { foreignKey: 'conversationId' });
    }
  }

  Message.init({
    messageId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'message_id' },
    conversationId: { type: DataTypes.INTEGER, allowNull: false, field: 'conversation_id' },
    senderType: { 
      type: DataTypes.STRING(10), 
      allowNull: false, 
      validate: { isIn: [['customer', 'employee']] }, 
      field: 'sender_type' 
    },
    content: { type: DataTypes.TEXT, allowNull: false },
    sentAt: { type: DataTypes.DATE, allowNull: false, field: 'sent_at' },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'updated_at' }
  }, {
    sequelize,
    modelName: 'Message',
    tableName: 'message',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Message;
};
