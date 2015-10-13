/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tasks', { 
    taskid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    worktype: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    shipperid: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    adminid: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    orderid: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    worktimes: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  });
};
