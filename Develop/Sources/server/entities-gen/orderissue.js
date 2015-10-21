/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('orderissue', { 
    issueid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    orderid: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  });
};
