/* jshint indent: 2 */
//var bycypt = require('bcrypt');
module.exports = function(sequelize, DataTypes) {

  var users = sequelize.define('users', {
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
      allowNull: true
    },
    userstatus: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    token: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    freezeTableName: true,
    timestamps: false,
    classMethods: {
      getAllUsers: function() {
        return users.findAll({});
      },
      authenticate: function(plainTextPassword){
        if(!plainTextPassword){
          return ''
        }else{
          var salt = b
        }
      }
      //getUser: function(user){
      //  return users.findOne({
      //    attributes: ['username','userrole','userstatus'],
      //    where:{
      //      'username': user.username,
      //
      //    }
      //  })
      //}
    }

  });

  //users.removeAttribute('id');

  return users;
};

/*
* Note by HoangLVQ:
*
* - timestamp: true => Xoá đi column CreateAt
* - freezeTableName: false => ngăn việc sửa tên model mặc định
* - classMethods: {} => Định nghĩa các funtion trong entity
* - users.removeAttribute('id) => Mặc định nếu bảng không primarykey thì sẽ tự thêm một column ID. Xoá đi cột ID này
*
* */
