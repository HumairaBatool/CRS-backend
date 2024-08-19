module.exports = (sequelize, DataTypes) => {
    const Attendance = sequelize.define('Attendance', {
      agentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users', 
            key: 'id'
          }
      },
      checkInTime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      checkOutTime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    });
  
    return Attendance;
  };
  