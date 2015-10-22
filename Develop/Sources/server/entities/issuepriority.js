/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var issuepriority = sequelize.define('issuepriority', {
    priorityid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    priority: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    freezeTableName: true,
    timestamps: false
  });
  return issuepriority
};
