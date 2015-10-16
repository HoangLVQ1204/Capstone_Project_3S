/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('roles', { 
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
