module.exports = (sequelize, DataTypes) => {
    const completeOrderDetail = sequelize.define('completeOrderDetail', {
     orderId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Orders', 
                key: 'id'
              }
          },
      serviceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Services', 
            key: 'id'
          }
      },
 
    });
  
    return completeOrderDetail;
  };
  