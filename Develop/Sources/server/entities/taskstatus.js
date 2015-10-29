/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var taskstatus = sequelize.define('taskstatus', {
    statusid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    statusname: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });
  return taskstatus;
};
