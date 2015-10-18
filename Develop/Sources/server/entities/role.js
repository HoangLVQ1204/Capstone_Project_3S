/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var role =  sequelize.define('role', {
    roleid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    rolename: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    freezeTableName: true,
    timestamps: false
    //classMethods: {
    //  getAllUsers: function() {
    //    return users.findAll({});
    //  }
    //}

  });
  return role;
};
