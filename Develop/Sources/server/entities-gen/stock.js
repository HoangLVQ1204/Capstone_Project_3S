/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('stock', { 
    stockid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    adminid: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    addresscoordination: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  });
};
