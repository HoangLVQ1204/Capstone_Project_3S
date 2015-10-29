/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var tasktype =  sequelize.define('tasktype', {
    typeid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    typename: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });
  return tasktype
};
