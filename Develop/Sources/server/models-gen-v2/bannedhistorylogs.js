/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('bannedhistorylogs', {
    logid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    adminid: {
      type: DataTypes.STRING,
      allowNull: true
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
  });
};
