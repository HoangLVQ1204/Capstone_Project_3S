/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('role', { 
    roleid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rolename: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  });
};
