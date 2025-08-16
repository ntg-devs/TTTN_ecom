'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class KolWithdrawRequest extends Model {
    static associate(models) {
      KolWithdrawRequest.belongsTo(models.KolInfo, { foreignKey: 'kolId' });
    }
  }
  KolWithdrawRequest.init({
    withdrawRequestId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'withdraw_request_id' },
    kolId: { type: DataTypes.INTEGER, allowNull: false, field: 'kol_id' },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    status: { type: DataTypes.STRING(50), allowNull: false },
    requestDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'request_date' },
    processedDate: { type: DataTypes.DATE, allowNull: true, field: 'processed_date' },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'updated_at' }
  }, {
    sequelize,
    modelName: 'KolWithdrawRequest',
    tableName: 'kol_withdraw_request',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return KolWithdrawRequest;
};
