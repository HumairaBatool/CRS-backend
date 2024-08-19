// models/RolePermissions.js
module.exports = (sequelize, DataTypes) => {
    const RolePermission = sequelize.define('RolePermission', {
      roleId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Roles',
          key: 'id',
        },
      },
      permissionId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Permissions',
          key: 'id',
        },
      },
    });


    return RolePermission;
  };
  