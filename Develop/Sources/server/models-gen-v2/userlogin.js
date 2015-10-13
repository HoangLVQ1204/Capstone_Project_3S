/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('userlogin', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    userrole: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
    },
    userstatus: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    token: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });
};
