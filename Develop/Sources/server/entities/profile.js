/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var profile =  sequelize.define('profile', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    identitycard: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phonenumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    freezeTableName: true,
    timestamps: false,
    classMethods: {
      getProfileUser: function(username){
        return profile.findOne({
          where: {
            username: username
          }
        });
      }
    }
  });
  return profile
};
