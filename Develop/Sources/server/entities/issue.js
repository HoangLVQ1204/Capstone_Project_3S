/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var issue = sequelize.define('issue', {
    issueid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    category: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    freezeTableName: true,
    timestamps: false,
    classMethods: {
      createNewIssue: function(newIssue){
        //return issue.build(newIssue).save();
        return issue.build({category: newIssue.category, content: newIssue.content}).save();
      }
    }
  });
  return issue;
};
