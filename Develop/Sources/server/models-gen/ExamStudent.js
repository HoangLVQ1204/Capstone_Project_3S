/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ExamStudent', { 
    ExamId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    StudentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Mark: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '0'
    },
    SubmissionLink: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    SubmissionDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: '(now'
    }
  });
};
