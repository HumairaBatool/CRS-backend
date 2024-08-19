module.exports = (sequelize, DataTypes) => {
    const Client = sequelize.define('Client',
      {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
  
      num1: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      num2: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      relation: {  
        type: DataTypes.STRING,
        allowNull: false,
      },
      closerName: {  
        type: DataTypes.STRING,
        allowNull: false,
      }
    
    });
  
    return Client;
  };
  