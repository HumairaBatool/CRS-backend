// seeders/YYYYMMDDHHMMSS-seed-role-permissions.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const roles = await queryInterface.sequelize.query(
      `SELECT id, name FROM Roles;`
    );

    const permissions = await queryInterface.sequelize.query(
      `SELECT id, name FROM Permissions;`
    );

    const roleMap = roles[0].reduce((map, role) => {
      map[role.name] = role.id;
      return map;
    }, {});

    const permissionMap = permissions[0].reduce((map, permission) => {
      map[permission.name] = permission.id;
      return map;
    }, {});

    const rolePermissions = [
      {
        roleName: 'SuperAdmin',
        permissions: [
          'Full System Access',
          'Manage User Roles',
          'System Operations',
          'Team Activity Monitoring',
          'Report access',
          'Data Modification Access',
          'Sales Statistics View',
          'Team Performance Monitoring',
          'Sales Data modification',
          'View Personal Performance',
        ],
      },
      {
        roleName: 'Admin',
        permissions: ['Manage User Roles', 'System Operations'],
      },
      {
        roleName: 'Manager',
        permissions: [
          'Team Activity Monitoring',
          'Report access',
          'Data Modification Access',
        ],
      },
      {
        roleName: 'SalesSupervisor',
        permissions: ['Sales Statistics View', 'Team Performance Monitoring'],
      },
      {
        roleName: 'SalesAgent',
        permissions: ['Sales Data modification', 'View Personal Performance'],
      },
    ];

    const rolePermissionData = [];
    rolePermissions.forEach((rolePermission) => {
      const roleId = roleMap[rolePermission.roleName];
      rolePermission.permissions.forEach((permission) => {
        const permissionId = permissionMap[permission];
        rolePermissionData.push({
          roleId,
          permissionId,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });
    });

    await queryInterface.bulkInsert('RolePermissions', rolePermissionData, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('RolePermissions', null, {});
  },
};
