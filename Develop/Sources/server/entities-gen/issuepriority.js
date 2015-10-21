/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('issuepriority', { 
    priorityid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    priority: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  });
};
