module.exports = (sequelize, DataTypes) => {
    const Service = sequelize.define('Service', {
      serviceName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      agentId:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
          model:'Agents',
          key:'id'
        }
      }
     
    });

    return Service;
  };
  