/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('PostCategory', { 
    PostId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    CategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  });
};
