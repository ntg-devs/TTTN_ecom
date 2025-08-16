'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      Role.hasMany(models.AccountRole, { foreignKey: 'roleId' });
    }
  }
  Role.init({
    roleId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'role_id' },
    roleName: { type: DataTypes.STRING, allowNull: false, field: 'role_name' },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'updated_at' }
  }, {
    sequelize,
    modelName: 'Role',
    tableName: 'role',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Role;
};
