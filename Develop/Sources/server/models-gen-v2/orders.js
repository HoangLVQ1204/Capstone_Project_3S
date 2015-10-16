/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('orders', {
    orderid: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    storeid: {
      type: DataTypes.STRING,
      allowNull: true,
      primaryKey: true
    },
    shipperid: {
      type: DataTypes.STRING,
      allowNull: true,
      primaryKey: true
    },
    ordertypeid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
    },
    date: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fee: {
      type: DataTypes.STRING,
      allowNull: true
    },
    pickupdate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    deliverydate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    recipientphone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    recipientname: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ledgerid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
    },
    statusid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
    },
    goods: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
    },
    stockid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
    },
    fee: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    cod: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  });
};
