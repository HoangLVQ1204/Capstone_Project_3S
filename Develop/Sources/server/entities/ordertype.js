/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var ordertype =  sequelize.define('ordertype', {
    typeid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    typename: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    freezeTableName: true,
    timestamps: false
  });
  return ordertype;
};
