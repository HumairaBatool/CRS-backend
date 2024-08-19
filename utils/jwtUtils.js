const jwt = require('jsonwebtoken');
const { sequelize } =require( '../models');
const { secretKey } = require('../config/config');

const getPermissionsByRoleId = async (roleId) => {
  try {
    const query = `
      SELECT p.name
      FROM RolePermissions rp
      JOIN Permissions p ON rp.permissionId = p.id
      WHERE rp.roleId = :roleId
    `;
    const results = await sequelize.query(query, {
      replacements: { roleId },
      type: sequelize.QueryTypes.SELECT,
    });
    return results.map((row) => row.name);
  } catch (error) {
    console.error('Error fetching permissions:', error);
    throw new Error('Error fetching permissions');
  }
};

const generateToken = async (user) => {
  const payload = {
    id: user.id,
    role: user.Role.name,
  };
  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

module.exports = {
  getPermissionsByRoleId,
  generateToken,
};
