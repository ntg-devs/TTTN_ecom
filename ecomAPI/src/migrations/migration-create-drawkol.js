  'use strict';

  module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('drawkols', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        kolId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'users', 
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        reviewId: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: 'users', 
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL', 
        },
        image_bank: {
          type: Sequelize.BLOB('long'), 
          allowNull: true,
        },
        amount: {
          type: Sequelize.DECIMAL(15, 2),
          allowNull: false,
        },
        status: {
          type: Sequelize.ENUM('pending', 'approved', 'rejected', 'completed'),
          allowNull: false,
          defaultValue: 'pending',
        },
        bank_account_name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        bank_account_number: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        bank_name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        bank_branch: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        withdrawAt: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        note: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
      });
    },

    down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('drawkols');
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_drawkols_status;');
    },
  };
