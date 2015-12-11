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
      allowNull: false
      // primaryKey: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isresolved: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    resolvetype: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    createddate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    sender: {
      type: DataTypes.STRING,
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

        issue.belongsTo(db.profile, {
          foreignKey: 'sender',
          constraints: false
        });
      },
      createNewIssue: function(newIssue){
        return issue.create({typeid: newIssue.typeid, description: newIssue.description, isresolved: newIssue.isresolved, resolvetype: newIssue.resolvetype, createddate: newIssue.createddate, sender: newIssue.sender});
      },
      changeIsPendingOfShipper: function(task, order, issuetype, orderissue, shipperId, issueId){
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
        }).then(sequelize.handler);
        //?????
        // return issue.build({categoryid: newIssue.categoryID, reason: newIssue.reason, description: newIssue.description}).save();
      },

      getAllIssue: function (issuetype, issuecategory) {
        return issue.findAll({
          include: [{
            model: issuetype, attributes: ['categoryid', 'typename'],
            include: {model : issuecategory, attributes: ['categoryname']}
          }]
        })
      },

      getIssueDetail: function (orderissue, issuetype, issuecategory, issueid, order, task, orderstatus, taskstatus, profile) {
        return issue.findOne({
          include: [{
            model: orderissue, attributes: ['orderid'],
            include: {
              model: order,
              attributes: ['pickupaddress','deliveryaddress', 'statusid','orderid','fee','storeid','ispending','iscancel'
              ,'deliveryprovinceid','deliverydistrictid', 'deliverywardid'],
              include:[{
                model: task,
                include: {
                  model: taskstatus,
                  attributes: ['statusname']
                },

              },{
                model: orderstatus,
                attributes: ['statusname']
              }]
            }
          },{
            model: issuetype, attributes: ['categoryid', 'typename'],
            include: {model : issuecategory, attributes: ['categoryname']}
          },{
            model: profile, attributes: ['avatar']
          }],
          where: {
            'issueid': issueid
          }
        }).then(sequelize.handler)
      },

      updateResolveIssue: function (issueid, type) {
        return issue.update({
              'isresolved': true,
              'resolvetype': type
            },{
              where: {
                'issueid': issueid
              }
            }).then(sequelize.handler)
        },

      getUserGetIssue: function () {
        return issue.findAll(
            { attributes: ['sender','issueid'],
              where: {
                'isresolved': false
          }
        })
      },

      getIssueBySender: function (sender) {
        return issue.findOne({
          where: {
            sender: sender,
            typeid: [1, 2, 3, 6, 8]
          },
          limit: 1,
          order: '"createddate" DESC',
        })
      }
    }
  });
  return issue;
};
