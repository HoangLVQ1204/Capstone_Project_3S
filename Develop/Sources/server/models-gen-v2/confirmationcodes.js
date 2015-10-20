/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('confirmationcodes', {
    codeid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    codecontent: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    typeid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
    },
    orderid: {
      type: DataTypes.STRING,
      allowNull: true,
      primaryKey: true
    }
  });
};
