const Sequelize = require("sequelize");
const config =
  require("../config/config")[process.env.NODE_ENV || "development"];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    logging: false,
  }
);

const db = {
  User: require("./user")(sequelize, Sequelize.DataTypes),
  Role: require("./role")(sequelize, Sequelize.DataTypes),
  Permission: require("./permission")(sequelize, Sequelize.DataTypes),
  RolePermission: require("./rolePermisson")(sequelize, Sequelize.DataTypes),

  Client: require("./client")(sequelize, Sequelize.DataTypes),
  Agent: require("./agent")(sequelize, Sequelize.DataTypes),
  Service: require("./services")(sequelize, Sequelize.DataTypes),
  Order: require("./order")(sequelize, Sequelize.DataTypes),
  CompleteOrderDetail: require("./completeOrderDetails")( sequelize, Sequelize.DataTypes),
  Attendance:require('./attendance')( sequelize, Sequelize.DataTypes),
};

// Define associations of user and role
db.User.belongsTo(db.Role, { foreignKey: "roleId" });
db.Role.hasMany(db.User, { foreignKey: "roleId" });

// Define associations of permissions and role
db.Role.belongsToMany(db.Permission, { through: db.RolePermission,foreignKey: "roleId",});
db.Permission.belongsToMany(db.Role, {through: db.RolePermission,foreignKey: "permissionId",});


// Client + Order relationship
db.Client.hasMany(db.Order, {foreignKey: 'clientId',onDelete: null,});
db.Order.belongsTo(db.Client, { foreignKey: 'clientId',});


// Agent + Service relationship
db.Agent.hasMany(db.Service, {foreignKey: 'agentId',onDelete: null,});
db.Service.belongsTo(db.Agent, { foreignKey: 'agentId',});

// Agent + Attendacnce relationship
db.Agent.hasMany(db.Attendance, {foreignKey: 'agentId',onDelete: null,});
db.Attendance.belongsTo(db.User, { foreignKey: 'agentId',})

// Service + order + completeOrderDetails relationship
db.Order.belongsToMany(db.Service, { through: db.CompleteOrderDetail,foreignKey: 'orderId' });
db.Service.belongsToMany(db.Order, { through: db.CompleteOrderDetail,foreignKey: 'serviceId'  });

sequelize.sync();

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
