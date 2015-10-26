/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var orderstatus =  sequelize.define('orderstatus', {
    statusid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    }
  }, {
    freezeTableName: true,
    timestamps: false
  });
  return orderstatus;
};
