/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    var task = sequelize.define('task', {
        taskid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        orderid: {
            type: DataTypes.STRING,
            allowNull: true,
            primaryKey: true
        },
        shipperid: {
            type: DataTypes.STRING,
            allowNull: true,
            primaryKey: true
        },
        adminid: {
            type: DataTypes.STRING,
            allowNull: true,
            primaryKey: true
        },
        taskdate: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        freezeTableName: true,
        timestamps: false,
        classMethods: {
            getAllHistoryOfShipper: function (shipperid, model) {
                return task.findAll({
                    attributes: [['taskid', 'id'],['taskdate','date']],
                    where: {
                        //shipperid: shipperid,
                        //taskdate: taskdate
                    },
                    include: [
                        {
                            model: model,
                            //limit: 1,
                            attributes: [['orderid', 'code'], 'statusid', 'fee', 'cod']
                        }
                    ]
                });
            }
        }
    });
    return task;
};
