module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define('Order', {
      Upgrade: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      serviceProvider: {
        type: DataTypes.STRING,
        allowNull: false,
        },
      duration: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      cardProvider: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nameOnCard:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {  
        type: DataTypes.STRING,
        allowNull: false,
      },
      cardNum: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [13, 19],
          },
      },
      dob: {
        type: DataTypes.STRING,
        allowNull: false
      },
      expiry: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isDate: true,
          },
      },
      CVV: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      securityPin: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      accountNum: {  
        type: DataTypes.STRING,
        allowNull: false,
      },
      SSN: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      clientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Clients', 
            key: 'id'
          }
      },
      
      comment: {
        type: DataTypes.STRING,
      },
    
    });
  
    return Order;
  };