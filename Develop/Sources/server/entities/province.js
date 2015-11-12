/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var province =  sequelize.define('province', {
    provinceid: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    freezeTableName: true,
    timestamps: false
  });
  return province;
};
