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
    isresolved: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    createddate: {
      type: DataTypes.DATE,
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
        return issue.build({typeid: newIssue.typeid, description: newIssue.description, isresolved: newIssue.isresolved, createddate: newIssue.createddate}).save();
      },
      preChangeIsPending: function(task, order, issuetype, orderissue, shipperId, issueId){
        return issue.findAll({
          attributes: ['issueid', 'typeid', 'isresolved'],
          where: {'issueid': issueId},
          include: [{
            model: issuetype,
            attributes: ['categoryid'],
            where: {categoryid: 1}
          }, {
            model: orderissue,
            attributes: ['orderid'],
            include: [{
              model: order,
              attributes: ['orderid', 'ispending'],
              include: {
                model: task,
                attributes: ['taskid', 'shipperid', 'statusid'],
                where: {
                  'shipperid': shipperId
                }
              }
            }]
          }]
        });
        return issue.build({categoryid: newIssue.categoryID, reason: newIssue.reason, description: newIssue.description}).save();
      },

      getAllIssue: function (issuetype, issuecategory) {
        return issue.findAll({
          include: [{
            model: issuetype, attributes: ['categoryid', 'typename'],
            include: {model : issuecategory, attributes: ['categoryname']}
          }]
        })
      },

      getIssueDetail: function (orderissue, issuetype, issuecategory, issueid, order, task, orderstatus, taskstatus) {
        return issue.findOne({
          include: [{
            model: orderissue, attributes: ['orderid'],
            include: {
              model: order,
              attributes: ['pickupaddress','deliveryaddress'],
              include:[{
                model: task,
                include: {
                  model: taskstatus,
                  attributes: ['statusname']
                }
              },{
                model: orderstatus,
                attributes: ['statusname']
              }]
            }
          },{
            model: issuetype, attributes: ['categoryid', 'typename'],
            include: {model : issuecategory, attributes: ['categoryname']}
          }],
          where: {
            'issueid': issueid
          }
        })
      },

      updateResolveIssue: function (issueid) {
        return issue.update({
              'isresolved': true
            },{
              where: {
                'issueid': issueid
              }
            })
        }
    }
  });
  return issue;
};
