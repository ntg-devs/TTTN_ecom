'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    static associate(models) {
      Employee.belongsTo(models.Account, { foreignKey: 'accountId' });
      Employee.hasMany(models.KolInfo, { foreignKey: 'employeeId' });
      Employee.hasMany(models.PurchaseOrder, { foreignKey: 'employeeId' });
      Employee.hasMany(models.Blog, { foreignKey: 'employeeId' });
      Employee.hasMany(models.Conversation, { foreignKey: 'employeeId' });
      Employee.hasMany(models.KolWithdrawRequest, { foreignKey: 'employeeId' });
    }
  }
  Employee.init({
    employeeId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'employee_id' },
    fullName: { type: DataTypes.STRING, allowNull: false, field: 'full_name' },
    dateOfBirth: { type: DataTypes.DATEONLY, field: 'date_of_birth' },
    gender: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING },
    idCard: { type: DataTypes.STRING, unique: true, allowNull: false, field: 'ID_card' },
    accountId: { type: DataTypes.INTEGER, field: 'account_id' },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'updated_at' }
  }, {
    sequelize,
    modelName: 'Employee',
    tableName: 'employee',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Employee;
};
