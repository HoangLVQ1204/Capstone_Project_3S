/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var task =  sequelize.define('task', {
    taskid: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
      getAllTaskOfShipper: function(model, shipperid, taskdate) {
        return task.findAll({
          where: {
            //shipperid: shipperid,
            //taskdate: taskdate
          },
          include: [
            {model: model}
          ]
        });
      }
    }
  });
  return task;
};
