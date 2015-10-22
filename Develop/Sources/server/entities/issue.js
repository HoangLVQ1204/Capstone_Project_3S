/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var issue = sequelize.define('issue', {
    issueid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    category: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
    },
    priority: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
    },
    issuename: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    freezeTableName: true,
    timestamps: false
  });
  return issue;
};
