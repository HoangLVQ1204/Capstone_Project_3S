/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('StudentProfile', { 
    StudentId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    FullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Birthdate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    Phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Status: {
      type: 'BIT',
      allowNull: false,
      defaultValue: 'B1'
    }
  });
};
