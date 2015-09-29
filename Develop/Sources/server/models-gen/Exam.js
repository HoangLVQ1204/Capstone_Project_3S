/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Exam', { 
    ExamId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Link: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    StartDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    DurationInMinutes: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  });
};
