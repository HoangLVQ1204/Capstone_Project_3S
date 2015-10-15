/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('issues', {
        issueid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        category: {
            type: DataTypes.INTEGER,
            allowNull: true,
            primaryKey: false
        },
        priority: {
            type: DataTypes.INTEGER,
            allowNull: true,
            primaryKey: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        freezeTableName: true,
        timestamps: false
    });
};
