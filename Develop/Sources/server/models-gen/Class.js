/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Class', { 
    ClassId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    CourseId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ClassName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Created: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: '(now'
    },
    Schedule: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    TeacherId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Status: {
      type: 'BIT',
      allowNull: false,
      defaultValue: 'B1'
    }
  });
};
