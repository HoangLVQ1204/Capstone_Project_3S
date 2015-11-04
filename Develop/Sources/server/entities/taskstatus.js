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
  }, {
    freezeTableName: true,
    timestamps: false,
    classMethods: {

      getAllTaskStatus: function(){
        return taskstatus.findAll();
      }
    }
  });
  return taskstatus;
};
