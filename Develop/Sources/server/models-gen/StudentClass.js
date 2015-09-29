/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('StudentClass', { 
    StudentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ClassId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  });
};
