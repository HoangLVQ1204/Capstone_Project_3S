/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('generalledgers', {
    ledgerid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    paymentid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
    },
    debitamount: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    creditamount: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    balance: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    storeid: {
      type: DataTypes.STRING,
      allowNull: true,
      primaryKey: true
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  });
};
