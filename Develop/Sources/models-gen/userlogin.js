/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('userlogin', { 
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userrole: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    userstatus: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    freezeTableName: true,
    timestamps: false
  });
};
