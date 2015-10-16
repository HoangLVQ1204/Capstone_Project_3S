/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('issuepriorities', {
    priorityid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    priority: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });
};
