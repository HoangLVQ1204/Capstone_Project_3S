/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var issue = sequelize.define('issue', {
    issueid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    typeid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    createddate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isresolved: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    freezeTableName: true,
    timestamps: false,
    classMethods: {
      associate: function(db) {
        issue.hasMany(db.orderissue, {
          foreignKey: 'issueid',
          constraints: false
        });

        issue.belongsTo(db.issuetype, {
          foreignKey: 'typeid',
          constraints: false
        });
      },
      createNewIssue: function(newIssue){
        return issue.build({categoryid: newIssue.categoryID, reason: newIssue.reason, description: newIssue.description}).save();
      },

      getAllIssue: function (orderissue, issuetype, issuecategory) {
        return issue.findAll({
          include: [{
            model: orderissue, attributes: ['orderid']
          },{
            model: issuetype, attributes: ['categoryid', 'typename'],
            include: {model : issuecategory, attributes: ['categoryname']}
          }]
        })
      }
    }
  });
  return issue;
};
