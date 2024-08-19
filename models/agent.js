module.exports = (sequelize, DataTypes) => {
  const Agent = sequelize.define("Agent", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
  });

  return Agent;
};

