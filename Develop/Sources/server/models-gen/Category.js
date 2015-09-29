/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Category', { 
    CategoryId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    CategoryName: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });
};
