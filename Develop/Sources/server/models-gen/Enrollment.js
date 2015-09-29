/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Enrollment', { 
    EnrollmentId: {
      type: DataTypes.INTEGER,
      primaryKey: true
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
    Email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    QA: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    CourseId: {
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
