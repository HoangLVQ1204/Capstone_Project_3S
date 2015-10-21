/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ordertype', { 
    typeid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    typename: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  });
};
