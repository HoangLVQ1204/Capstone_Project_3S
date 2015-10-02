/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('User', { 
    UserId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,   
      primaryKey: true
    },
    Username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Status: {
      type: 'BIT',
      allowNull: false,
      defaultValue: 'B1'
    },
    Role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    FacebookToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    GoogleToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    LevelId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }    
  }, {
      freezeTableName: true,
      timestamps: false
  });
};


