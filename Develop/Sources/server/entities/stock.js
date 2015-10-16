/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var stock = sequelize.define('stock', {
    stockid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    adminid: {
      type: DataTypes.STRING,
      allowNull: true,
      primaryKey: true
    },
    addresscoordination: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    freezeTableName: true,
    timestamps: false
  });
  return stock;
};
