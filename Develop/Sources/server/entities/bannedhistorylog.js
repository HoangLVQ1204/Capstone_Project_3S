/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var bannedhistorylog = sequelize.define('bannedhistorylog', {
    logid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    adminid: {
      type: DataTypes.STRING,
      allowNull: true,
      primaryKey: true
    },
    username: {
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
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    freezeTableName: true,
    timestamps: false
  });
  return bannedhistorylog;
};
