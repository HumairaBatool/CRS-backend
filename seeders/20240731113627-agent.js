'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.bulkInsert('Agents', [
      {
        name: 'agent1',
        email: 'agent1@example.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'agent2',
        email: 'agent2@example.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'agent3',
        email: 'agent3@example.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },


  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Agents', null, {});
  }
};
