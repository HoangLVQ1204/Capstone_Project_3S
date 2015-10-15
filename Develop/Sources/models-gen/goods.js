/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('goods', { 
    goodsid: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
  }, {
    freezeTableName: true,
    timestamps: false
  });
};
