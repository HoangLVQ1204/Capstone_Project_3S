/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Course', { 
    CourseId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    CourseName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    Price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    DurationInDays: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    StartDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    FinishDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    Status: {
      type: 'BIT',
      allowNull: false,
      defaultValue: 'B1'
    }
  });
};
