/**
 * Created by Nguyen Van Quyen on 10/16/2015.
 */

module.exports = function(sequelize, DataTypes) {
    var workingstatus =  sequelize.define('workingstatus', {
        statusid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        statusname: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        freezeTableName: true,
        timestamps: false
    });
    return workingstatus;
};
