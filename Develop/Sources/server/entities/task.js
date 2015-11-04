/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    var task = sequelize.define('task', {
        taskid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        orderid: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        shipperid: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        adminid: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        statusid: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        typeid: {
            type: DataTypes.INTEGER,
            allowNull: false,
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

                task.belongsTo(db.user,
                    {as:'assigner', foreignKey: 'adminid'}
                );
                task.belongsTo(db.user,
                    {as: 'shipper',foreignKey: 'shipperid'}
                );
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
            },

            updateStatusOfTask: function (taskid, status) {
                return task.update({
                   'statusid': status,
                },{
                    where: {
                        'taskid': taskid
                    }
                })
            },
            updateShipperOfTask: function (taskid, shipperid) {
                            return task.update({
                               'shipperid': shipperid,
                            },{
                                where: {
                                    'taskid': taskid
                                }
                            })
                        },

            assignTaskForShipper: function(shipper){
                //console.log(shipper);
                return task.findOrCreate({
                    where: {
                        orderid: shipper.orderid,
                        statusid: shipper.statusid,
                        typeid: shipper.typeid
                    },
                    defaults: {
                        adminid: shipper.adminid,
                        shipperid: shipper.shipperid,
                        taskdate: shipper.taskdate
                    }
                }).spread(function(tasks, created){
                    if (!created && tasks.shipperid != shipper.shipperid)
                        if (tasks.statusid == 4){
                            task.create({
                                    'orderid': shipper.orderid,
                                    'shipperid': shipper.shipperid,
                                    'adminid': shipper.adminid,
                                    'statusid': 1,
                                    'typeid': shipper.typeid,
                                    'taskdate': shipper.taskdate
                                });
                            task.updateStatusOfTask(tasks.taskid, 5);
                        }
                    else  task.updateShipperOfTask(tasks.taskid, shipper.shipperid);

                })
            },

            getAllTask: function(user, order, orderstatus, taskstatus, tasktype, store, profile){
                return task.findAll({
                    include: [{
                        model: user,
                        as: 'assigner'
                    },{
                        model: user,
                        as: 'shipper',
                        include: [{model: profile,  attributes: ['name']}]
                    },{
                        model: order,
                        include: [{
                            model: orderstatus,  attributes: ['statusname']
                        },{
                            model: store,  attributes: ['name']
                        }]
                    },{
                        model: taskstatus,
                        attributes: ['statusid','statusname']
                    },{
                        model: tasktype,
                        attributes: ['typeid','typename']
                    }],
                    where:{
                        'shipperid': { $ne: null}
                    }
                })
            },

            countTaskByShipperId: function(shipperid, taskStatusModel){
                return task.findAll({
                    attributes: ['statusid', [sequelize.fn('count', sequelize.col('task.statusid')), 'count']],
                    group: ['task.statusid'],
                    where:{
                        shipperid: shipperid
                    },
                    //include: {
                    //    model: taskStatusModel,
                    //    attributes: ['statusname']
                    //}
                })
			},

            getAll: function () {
              return task.findAll();
            },

            updateTaskState: function (newTask) {
                return task.update(
                    {'statusid': newTask.selectedStatus.statusid, 'typeid': newTask.selectedType.typeid },
                    {
                        where: {
                            'taskid': newTask.taskid
                        }
                    })
            }

        }
    });
    return task;
};
