/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var bannedhistorylog = sequelize.define('bannedhistorylog', {
    logid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    adminid: {
      type: DataTypes.STRING,
      allowNull: true,
      primaryKey: true
    },
    shipperid: {
      type: DataTypes.STRING,
      allowNull: true,
      primaryKey: true
    },
    storeid: {
      type: DataTypes.STRING,
      allowNull: true,
      primaryKey: true
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    bannedtime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    freezeTableName: true,
    timestamps: false,
    classMethods: {
      postNewLog : function (log) {
        return bannedhistorylog.create({
          'adminid': log.adminid,
          'shipperid': log.shipperid,
          'storeid': log.storeid,
          'reason': log.reason,
          'bannedtime': log.bannedtime,
          'type': log.type
        })
      }
    }
  });
  return bannedhistorylog;
};
