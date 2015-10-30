/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('confirmationcode', { 
    codeid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    codecontent: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    typeid: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    orderid: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  });
};
