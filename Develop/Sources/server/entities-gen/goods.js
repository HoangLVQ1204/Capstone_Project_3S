/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('goods', { 
    goodsid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    orderid: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    stockid: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    weight: {
      type: 'DOUBLE PRECISION',
      allowNull: true,
    },
    lengthsize: {
      type: 'DOUBLE PRECISION',
      allowNull: true,
    },
    widthsize: {
      type: 'DOUBLE PRECISION',
      allowNull: true,
    },
    heightsize: {
      type: 'DOUBLE PRECISION',
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  });
};
