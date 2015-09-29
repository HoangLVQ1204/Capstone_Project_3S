/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Attendance', { 
    ClassId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    StudentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    Status: {
      type: 'BIT',
      allowNull: false,
      defaultValue: 'B0'
    }
  });
};
