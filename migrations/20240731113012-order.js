"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { DataTypes } = Sequelize; // Destructure DataTypes from Sequelize

    await queryInterface.createTable("Orders", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      Upgrade: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      serviceProvider: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      duration: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cardProvider: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nameOnCard: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cardNum: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [13, 19],
        },
      },
      expiry: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: true,
        },
      },

      dob: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: true,
        },
      },
      CVV: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      securityPin: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      accountNum: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      SSN: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      clientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Clients",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: null,
      },

      comment: {
        type: DataTypes.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Orders");
  },
};
