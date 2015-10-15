/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('generalledgers', { 
    ledgerid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    paymentid: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    debitamount: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    creditamount: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    balance: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    storeid: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  }, {
    freezeTableName: true,
    timestamps: false
  });
};
