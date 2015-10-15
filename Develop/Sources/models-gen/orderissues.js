/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('orderissues', { 
    issueid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    orderid: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    freezeTableName: true,
    timestamps: false
  });
};
