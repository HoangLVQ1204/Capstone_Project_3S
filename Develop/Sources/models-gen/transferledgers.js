/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('transferledgers', { 
    paymentid: {
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
    payfrom: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    paytime: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    freezeTableName: true,
    timestamps: false
  });
};
