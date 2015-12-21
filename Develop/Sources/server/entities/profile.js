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
    // addresscoordination: {
    //   type: DataTypes.TEXT,
    //   allowNull: true
    // },
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
      },
      getAllProfileToCheck: function(){
        return profile.findAll({
          attributes: ['email', 'identitycard', 'phonenumber']
        });
      },
      addNewProfile: function(newProfile){
        return profile.build(newProfile).save();
      },
      updateProfile: function(newProfile){
        return profile.update({
            'name': newProfile.name,
            'identitycard': newProfile.identitycard,
            'address': newProfile.address,
            'dob': newProfile.dob,
            'email': newProfile.email,
            'phonenumber': newProfile.phonenumber,
            'avatar': newProfile.avatar
        },{
            where: {
              'username': newProfile.username

            }
        })
      }
    }
  });
  return profile
};
