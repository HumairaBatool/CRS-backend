// seeders/YYYYMMDDHHMMSS-seed-permissions.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const permissions = [
      "Full System Access",
      "Manage User Roles",
      "System Operations",
      "Team Activity Monitoring",
      "Report access",
      "Data Modification Access",
      "Sales Statistics View",
      "Team Performance Monitoring",
      "Sales Data modification",
      "View Personal Performance",
    ].map(permission => ({
      name: permission,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert('Permissions', permissions, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Permissions', null, {});
  },
};
