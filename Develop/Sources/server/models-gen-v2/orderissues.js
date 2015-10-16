/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('orderissues', {
    issueid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    orderid: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    }
  });
};
