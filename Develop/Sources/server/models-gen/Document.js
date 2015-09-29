/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Document', { 
    DocumentId: {
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
    Description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Visible: {
      type: 'BIT',
      allowNull: false,
      defaultValue: 'B0'
    },
    Rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '0'
    },
    Created: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: '(now'
    },
    Updated: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: '(now'
    },
    Notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  });
};
