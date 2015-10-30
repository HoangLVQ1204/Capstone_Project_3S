/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('task', { 
    taskid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    shipperid: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    adminid: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    taskdate: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  });
};
