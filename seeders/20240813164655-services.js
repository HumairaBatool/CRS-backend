'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Services', [
      {
        serviceName: 'Cable',
        agentId:1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        serviceName: 'Landline',
        agentId:2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        serviceName: 'Internet',
        agentId:3,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Services', null, {});
  }
};
