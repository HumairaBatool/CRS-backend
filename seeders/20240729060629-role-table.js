// seeders/YYYYMMDDHHMMSS-seed-roles.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const roles = [
      { name: 'SuperAdmin', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Admin', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Manager', createdAt: new Date(), updatedAt: new Date() },
      { name: 'SalesSupervisor', createdAt: new Date(), updatedAt: new Date() },
      { name: 'SalesAgent', createdAt: new Date(), updatedAt: new Date() },
    ];

    await queryInterface.bulkInsert('Roles', roles, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Roles',null,{})
  }
}