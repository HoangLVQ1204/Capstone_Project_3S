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
            allowNull: false,
            primaryKey: true
        },
        shipperid: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        adminid: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        statusid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        typeid: {
            type: DataTypes.INTEGER,
            allowNull: false,
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
            associate: function(db) {
                task.belongsTo(db.order, {
                    foreignKey: 'orderid',
                    constraints: false
                });

                task.belongsTo(db.tasktype, {
                    foreignKey: 'typeid',
                    constraints: false
                });

                task.belongsTo(db.taskstatus, {
                    foreignKey: 'statusid',
                    constraints: false
                });
            },
            getAllHistoryOfShipper: function (shipperid, modelOrder, modelOrderStatus) {
                return task.findAll({
                    attributes: [['taskid', 'id'],['taskdate','date']],
                    where: {
                        shipperid: shipperid,
                        //taskdate: taskdate
                    },
                    include: [
                        {
                            model: modelOrder,
                            //limit: 1,
                            attributes: [['orderid', 'code'], 'statusid', 'fee', 'cod'],
                            where:{
                                //statusid: '1 or 2'
                            },
                            include: {
                                model: modelOrderStatus,
                                attributes: [['statusname', 'statusid']]
                            }
                        }
                    ]
                });
            },
            getMapdataById: function (orderModel, shipperID, order){
                if(order=="all") {
                    return task.findAll({
                        attributes: ['orderid', ['shipperid', 'shipperID']],
                        where: {
                            shipperid: shipperID
                        },
                        include: {
                            model: orderModel,
                            attributes: [['storeid', 'storeID'], ['pickupaddresscoordination', 'storePos'], ['deliveryaddress', 'customerPos']]
                        }
                    });
                }else{
                    return task.findAll({
                        attributes: ['orderid', ['shipperid', 'shipperID']],
                        where: {
                            shipperid: shipperID,
                            orderid: order
                        },
                        include: {
                            model: orderModel,
                            attributes: [['storeid', 'storeID'], ['pickupaddresscoordination', 'storePos'], ['deliveryaddress', 'customerPos']]
                        }
                    });
                }
            }
        }
    });
    return task;
};
