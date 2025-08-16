'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class KolTier extends Model {
    static associate(models) {
      KolTier.hasMany(models.KolInfo, { foreignKey: 'tierId' });
    }
  }
  KolTier.init({
    tierId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'tier_id' },
    tierName: { type: DataTypes.STRING, allowNull: false, field: 'tier_name' },
    commissionRate: { type: DataTypes.DECIMAL(5, 2), allowNull: false, validate: { min: 0 }, field: 'commission_rate' },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'updated_at' }
  }, {
    sequelize,
    modelName: 'KolTier',
    tableName: 'kol_tier',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return KolTier;
};
