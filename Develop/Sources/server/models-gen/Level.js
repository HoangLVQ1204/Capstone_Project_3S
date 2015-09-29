/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Level', { 
    LevelId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    Status: {
      type: 'BIT',
      allowNull: false,
      defaultValue: 'B1'
    }
  });
};
