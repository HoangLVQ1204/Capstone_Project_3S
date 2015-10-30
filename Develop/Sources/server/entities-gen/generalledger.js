/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('generalledger', { 
    ledgerid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    adminid: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    storeid: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    amount: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    balance: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    paydate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    payfrom: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  });
};
