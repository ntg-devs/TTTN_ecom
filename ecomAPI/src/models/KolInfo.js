'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class KolInfo extends Model {
    static associate(models) {
      KolInfo.belongsTo(models.Account, { foreignKey: 'accountId' });
      KolInfo.belongsTo(models.Employee, { foreignKey: 'employeeId' });
      KolInfo.belongsTo(models.KolTier, { foreignKey: 'tierId' });
      KolInfo.hasMany(models.AffiliateLink, { foreignKey: 'kolId' });
      KolInfo.hasMany(models.KolWithdrawRequest, { foreignKey: 'kolId' });
    }
  }
  KolInfo.init({
    kolId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'kol_id' },
    accountId: { type: DataTypes.INTEGER, allowNull: false, field: 'account_id' },
    fullName: { type: DataTypes.STRING, allowNull: false, field: 'full_name' },
    dateOfBirth: { type: DataTypes.DATEONLY, field: 'date_of_birth' },
    gender: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING },
    fbLink: { type: DataTypes.STRING, field: 'fb_link' },
    tiktokLink: { type: DataTypes.STRING, field: 'tiktok_link' },
    instagramLink: { type: DataTypes.STRING, field: 'instagram_link' },
    youtubeLink: { type: DataTypes.STRING, field: 'youtube_link' },
    otherLink: { type: DataTypes.STRING, field: 'other_link' },
    employeeId: { type: DataTypes.INTEGER, field: 'employee_id' },
    tierId: { type: DataTypes.INTEGER, field: 'tier_id' },
    approvedAt: { type: DataTypes.DATE, field: 'approved_at' },
    rejectReason: { type: DataTypes.TEXT, field: 'reject_reason' },
    status: { type: DataTypes.STRING(20) },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'updated_at' }
  }, {
    sequelize,
    modelName: 'KolInfo',
    tableName: 'kol_info',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return KolInfo;
};
