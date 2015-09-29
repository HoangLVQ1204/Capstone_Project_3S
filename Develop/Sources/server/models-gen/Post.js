/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Post', { 
    PostId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    Title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    CommentStatus: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Modified: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: '(now'
    },
    Created: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: '(now'
    },
    CommentCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '0'
    }
  });
};
