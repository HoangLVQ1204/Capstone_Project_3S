/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var confirmationcode = sequelize.define('confirmationcode', {
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
  }, {
    freezeTableName: true,
    timestamps: false
  });
  return confirmationcode
};
