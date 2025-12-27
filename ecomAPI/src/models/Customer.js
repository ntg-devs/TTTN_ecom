'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    static associate(models) {
      Customer.belongsTo(models.Account, { foreignKey: 'accountId' });
      Customer.hasMany(models.Conversation, { foreignKey: 'customerId' });
      Customer.hasMany(models.BlogComment, { foreignKey: 'customerId' });
      Customer.hasMany(models.Orders, { foreignKey: 'customerId' });
      Customer.hasMany(models.Cart, { foreignKey: 'customerId' });
    }
  }

  Customer.init({
    customerId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, field: 'customer_id' },
    accountId: { type: DataTypes.INTEGER, allowNull: false, field: 'account_id' },
    fullName: { type: DataTypes.STRING, allowNull: false, field: 'full_name' },
    dateOfBirth: { type: DataTypes.DATEONLY, allowNull: true, field: 'date_of_birth' },
    gender: { type: DataTypes.STRING, allowNull: true },
    phone: { type: DataTypes.STRING, allowNull: true },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'updated_at' }
  }, {
    sequelize,
    modelName: 'Customer',
    tableName: 'customer',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Customer;
};
