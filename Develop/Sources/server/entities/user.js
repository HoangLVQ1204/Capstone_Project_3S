/* jshint indent: 2 */
var bcrypt = require('bcryptjs');

module.exports = function(sequelize, DataTypes) {

  var user = sequelize.define('user', {
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
    }
  }, {
    freezeTableName: true,
    timestamps: false,
    instanceMethods: {
      authenticate: function(plainTextPassword){
        return bcrypt.compareSync(plainTextPassword, this.password);
      },
      encyptPassword: function(plainTextPassword){
        if(!plainTextPassword){
          return ''
        }else{
          var salt = bcrypt.genSaltSync(10);
          return bcrypt.hashSync(plainTextPassword,salt);
        }
      }
    },
    classMethods: {
      associate: function(db) {
        user.belongsTo(db.profile, {
          foreignKey: 'username',
          constraints: false
        });

        //user.belongsTo(db.workingstatus, {
        //  foreignKey: 'workingstatusid',
        //  constraints: false
        //});

        user.hasMany(db.task,
            {as:'assigner', foreignKey: 'adminid'}
        );
        user.hasMany(db.task,
            {as: 'tasks',foreignKey: 'shipperid'}
        );

      },

      getAllUsers: function() {
        return user.findAll({});
      },

      getAllUsersHasRole: function(role, profile, workingstatus) {
        return user.findAll({
          include:[{
              model: profile
          }],
          where: {
            'userrole': role
          }
        });
      },

      findUserByUsername:  function(username){
        return user.findOne({
          where: {
            username: username
          }
        });
      },

      //findUserByUsername:  function(username,profile){
      //  return user.findOne({
      //    include:[{model:profile, attributes: ['name','identitycard','avatar']}],
      //    where: {
      //      username: username
      //    }
      //  });
      //},

      postOneUser: function(newUser){
        return user.build(newUser).save();
      },

      deleteUser: function (users) {
        return users.destroy()
      },

      putUser: function(currentUser) {
        return currentUser.save();
      },

      getAllShipperWithTask: function(task, profile, order, orderstatus, tasktype, taskstatus) {
        return user.findAll({
          include:[{
            model: task,
            as:'tasks',
            //required: false,
            include: [
              {
                model: order,
                attributes: ['orderid', 'storeid', 'statusid', 'deliveryaddress','pickupaddress'],
                include: [{model: orderstatus,  attributes: ['statusname']}]
              },
              {
                model: tasktype,
                attributes: ['typename']
              },
              {
                model: taskstatus,
                //required: false,
                attributes: ['statusname'],
                where:{
                  statusid: [1,4]
                }
              },

            ]
          },{model: profile}],
          where: {
            'userrole': 1
            //'username': 'task.shipperid'
          }
        });
      },

      authenticate: function(plainTextPassword) {
        if (!plainTextPassword) {
        } else {
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
      },

      //getShipperStatus: function(shipperid) {
      //  return user.findOne({
      //    attributes: [['workingstatusid', 'status']],
      //    where: {
      //      username: shipperid
      //    }
      //  });
      //},
  }

  });
  return user;
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
