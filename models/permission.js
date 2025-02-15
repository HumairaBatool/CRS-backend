module.exports = (sequelize, DataTypes) => {
    const Permission = sequelize.define('Permission', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    });
    
    return Permission;
};
