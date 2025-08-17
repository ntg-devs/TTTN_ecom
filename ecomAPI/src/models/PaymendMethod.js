'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class PaymentMethod extends Model {
        static associate(models) {
            // Nếu sau này có bảng Order liên kết với PaymentMethod, có thể thêm:
            // PaymentMethod.hasMany(models.Order, { foreignKey: 'paymentMethodId' });
        }
    }

    PaymentMethod.init({
        paymentMethodId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            field: 'payment_method_id'
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'Tên phương thức: Tiền mặt, Chuyển khoản, Thẻ tín dụng, Ví điện tử...'
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            field: 'is_active',
            comment: 'Bật/tắt phương thức thanh toán'
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            field: 'created_at'
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            field: 'updated_at'
        }
    }, {
        sequelize,
        modelName: 'PaymentMethod',
        tableName: 'payment_method',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return PaymentMethod;
};