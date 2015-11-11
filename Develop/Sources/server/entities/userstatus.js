/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var userstatus =  sequelize.define('userstatus', {
    statusid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    statusname: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    freezeTableName: true,
    timestamps: false
  });
  return userstatus;
};
