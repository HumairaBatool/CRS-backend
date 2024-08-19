"use strict";

const bcrypt = require("bcrypt");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Users", [
      {
        username: "superadmin1",
        email: "superadmin1@example.com",
        password: bcrypt.hashSync("123", 10),
        roleId: 1, // Superadmin Role
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: "admin1",
        email: "admin1@example.com",
        password: bcrypt.hashSync("123", 10),
        roleId: 2, // Admin Role
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: "manager1",
        email: "manager1@example.com",
        password: bcrypt.hashSync("123", 10),
        roleId: 2, // manager Role
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: "supervisor1",
        email: "supervisor1@example.com",
        password: bcrypt.hashSync("123", 10),
        roleId: 2, // supervisor Role
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: "agent1",
        email: "agent1@example.com",
        password: bcrypt.hashSync("123", 10),
        roleId: 5, // Agent Role
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: "agent2",
        email: "agent2@example.com",
        password: bcrypt.hashSync("123", 10),
        roleId: 5, // Agent Role
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: "agent3",
        email: "agent3@example.com",
        password: bcrypt.hashSync("123", 10),
        roleId: 5, // Agent Role
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
