/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var issue = sequelize.define('issue', {
    issueid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    categoryid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    freezeTableName: true,
    timestamps: false,
    classMethods: {
      createNewIssue: function(newIssue){
        return issue.build({categoryid: newIssue.categoryID, reason: newIssue.reason, description: newIssue.description}).save();
      }
    }
  });
  return issue;
};
