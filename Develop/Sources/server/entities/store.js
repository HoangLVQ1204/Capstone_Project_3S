/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    var store = sequelize.define('store', {
        storeid: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        address: {
            type: DataTypes.STRING,
            allowNull: true
        },
        addresscoordination: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        phonenumber: {
            type: DataTypes.STRING,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        freezeTableName: true,
        timestamps: false
    });
    return store;
};
