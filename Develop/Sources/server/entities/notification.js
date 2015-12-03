/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var notification = sequelize.define('notification', {
    notificationid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isread: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createddate: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  },{
    freezeTableName: true,
    timestamps: false,
    classMethods: {
      associate: function(db) {
        // notification.belongsTo(db.user, {
        //   foreignKey: 'username',
        //   constraints: false
        // });
      },

      getTotalNumberOfNotifications: function(username) {
        return notification.count({
          where: {
            username: username
          }
        });
      },

      getTotalUnreadNotifications: function(username) {
        return notification.count({
          where: {
            username: username,
            isread: false
          }
        });
      },

      getNotifications: function(username, offset, limit) {
        return notification.findAll({
          attributes: ['notificationid', 'type', 'title', 'content', 'url', 'isread', 'createddate'],
          where: {
            username: username
          },
          offset: offset,
          limit: limit,
          order: [
            ['createddate', 'DESC']
          ]
        });
        // return sequelize.query('SELECT * FROM notification WHERE username = :username ORDER BY createddate DESC OFFSET :offset LIMIT :limit',
        //   { 
        //     replacements: { 
        //       username: username,
        //       offset: offset,
        //       limit: limit
        //   }, type: sequelize.QueryTypes.SELECT });
      },

      getOne: function(id) {
        return notification.findOne({
          notificationid: id
        }).then(sequelize.handler);
      },

      addNotification: function(data) {
        return notification.create(data).then(sequelize.handler);        
      },

      updateNotification: function(data) {
        return notification.update(
          {
            isread: data.isread
          }, 
          {
            where: {
              notificationid: data.notificationid
            }
          }).then(sequelize.handler);
      }
    }
  });

  return notification;
};
