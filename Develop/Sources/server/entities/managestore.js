/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var managestore = sequelize.define('managestore', {
    managerid: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    storeid: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    }
  }, {
    freezeTableName: true,
    timestamps: false
  });
  return managestore;
};
