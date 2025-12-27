'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    static associate(models) {
      Account.hasMany(models.AccountRole, { foreignKey: 'accountId' });
      Account.hasOne(models.Customer, { foreignKey: 'accountId' });
      Account.hasOne(models.Employee, { foreignKey: 'accountId' });
      Account.hasOne(models.KolInfo, { foreignKey: 'accountId' });
    }
  }
  Account.init({
    accountId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'account_id' },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, field: 'is_active' },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'updated_at' }
  }, {
    sequelize,
    modelName: 'Account',
    tableName: 'account',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Account;
};
