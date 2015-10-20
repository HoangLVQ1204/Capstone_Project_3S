/**
 * Created by Nguyen Van Quyen on 10/17/2015.
 */

var _ = require('lodash');

module.exports = function (app) {

    var db = app.get('models');

    var getTask = function(req,res,next) {
        var shipperid = 'hoang';
        var taskdate = '2015-02-09';
        var Task = db.task;
        var Order = db.order;
        var OrderStatus = db.orderstatus;
        //get all task of shipper
        Order.hasMany(Task, {
            foreignKey: 'orderid',
            constraints: false
        });
        //get status name of order
        Order.belongsTo(OrderStatus, {
            foreignKey: 'statusid',
            constraints: false
        });

        return Order.getAllTaskOfShipper(Task, OrderStatus, shipperid, taskdate)
            .then(function(tasks) {
                var group = {};
                if (_.isEmpty(tasks) == false) {
                    var listTasks=[];
                    _.each(tasks, function(task){
                        listTasks.push({'orderid': task.dataValues.orderid, 'ordertypeid': task.dataValues.ordertypeid,
                            'statusid': task.dataValues.statusid, 'statusname':  task['orderstatus'].dataValues.statusname, 'tasktype': task['tasks'][0].dataValues.tasktype,
                            'pickupaddress': task.dataValues.pickupaddress, 'deliveryaddress': task.dataValues.deliveryaddress,
                            'pickupdate': task.dataValues.pickupdate, 'deliverydate': task.dataValues.deliverydate
                        });
                    });
                    //Group by order type
                    group['Pickup'] = group['Pickup'] || [];
                    group['Ship'] = group['Ship'] || [];
                    group['Express'] = group['Express'] || [];
                    _.each(listTasks, function(item){
                        if(_.isEqual(item['ordertypeid'], 1)) {
                            if(_.isEqual(item['tasktype'], 1)) {
                                group['Pickup'].push(item);
                            } else {
                                group['Ship'].push(item);
                            }
                        } else {
                            group['Express'].push(item);
                        }
                    });
                }
                res.status(200).json(group);
            }, function (err) {
                next(err);
            })
    };

    var getHistory = function (shipperid, next) {
        var History = db.task;
        var Order = db.order;
        History.hasMany(Order, {
            foreignKey: 'taskid',
            constraints: false
        });
        return History.getAllHistoryOfShipper(shipperid, Order)
            .then(function (history) {
                var list = [];
                history.map(function (order) {
                    list.push({'id': order.dataValues.id, 'code': order.dataValues.orders[0].dataValues.code, 'statusid': order.dataValues.orders[0].dataValues.statusid, 'date': order.dataValues.orders[0].dataValues.taskdate, 'fee': order.dataValues.orders[0].dataValues.fee, 'COD': order.dataValues.orders[0].dataValues.cod});
                    console.log(1);
                    console.log(order.dataValues.orders[0].dataValues.code);
                });
                return list;
            }, function (err) {
                next(err);
            })
    };

    return {
        getTask: getTask,
        getHistory: getHistory
    }

}
