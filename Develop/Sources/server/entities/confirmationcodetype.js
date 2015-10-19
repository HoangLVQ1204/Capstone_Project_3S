/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var confirmationcodetype =  sequelize.define('confirmationcodetype', {
    typeid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    codetype: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {

  }, {
    freezeTableName: true,
    timestamps: false
  });
  return confirmationcodetype
};
