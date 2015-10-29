/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('orderlog', { 
    logid: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    orderid: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    storeid: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    taskid: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ordertypeid: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    pickupaddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    deliveryaddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pickupdate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deliverydate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    recipientphone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    recipientname: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ledgerid: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    statusid: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    fee: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    cod: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    pickupaddresscoordination: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    deliveryaddresscoordination: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    uptimestamp: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updater: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  });
};
