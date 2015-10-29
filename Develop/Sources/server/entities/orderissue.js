/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var orderissue = sequelize.define('orderissue', {
    issueid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    orderid: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    freezeTableName: true,
    timestamps: false
  });
  return orderissue;
};
