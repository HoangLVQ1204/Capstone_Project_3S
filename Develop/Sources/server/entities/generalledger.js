/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var generalledger =  sequelize.define('generalledger', {
    ledgerid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    adminid: {
      type: DataTypes.STRING,
      allowNull: true,
      primaryKey: true
    },
    storeid: {
      type: DataTypes.STRING,
      allowNull: true,
      primaryKey: true
    },
    amount: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    balance: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    paydate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    payfrom: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    totaldelivery: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    totalcod: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    freezeTableName: true,
    timestamps: false
  });
  return generalledger;
};
