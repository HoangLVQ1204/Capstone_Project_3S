/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('issue', { 
    issueid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    category: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    priority: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    issuename: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  });
};
