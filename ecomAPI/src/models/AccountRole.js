'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AccountRole extends Model {
    static associate(models) {
      AccountRole.belongsTo(models.Account, { foreignKey: 'accountId' });
      AccountRole.belongsTo(models.Role, { foreignKey: 'roleId' });
    }
  }
  AccountRole.init({
    accountRoleId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'account_role_id' },
    accountId: { type: DataTypes.INTEGER, allowNull: false, field: 'account_id' },
    roleId: { type: DataTypes.INTEGER, allowNull: false, field: 'role_id' },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'created_at' }
  }, {
    sequelize,
    modelName: 'AccountRole',
    tableName: 'account_role',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });
  return AccountRole;
};
