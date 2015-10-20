/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('goods', {
    goodsid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    weight: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    lengthsize: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    widthsize: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    heightsize: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  });
};
