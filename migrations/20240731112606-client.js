"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.createTable("Clients", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
     
      num1: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      num2: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      relation: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      closerName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
  
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Clients");
  },
};
