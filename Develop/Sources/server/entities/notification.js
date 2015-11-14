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

      }
    }
  });

  return notification;
};
