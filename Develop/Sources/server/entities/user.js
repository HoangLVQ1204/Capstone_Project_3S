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
    },
    logintime: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    freezeTableName: true,
    timestamps: false,
    instanceMethods: {
      authenticate: function(plainTextPassword){
        return bcrypt.compareSync(plainTextPassword, this.password);
      },

      isBanned: function(){
        return (this.userstatus == 3 ? true : false);
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

      encyptPassword: function(plainTextPassword){
        if(!plainTextPassword){
          return ''
        }else{
          var salt = bcrypt.genSaltSync(10);
          return bcrypt.hashSync(plainTextPassword,salt);
        }
      },

      getAllUsers: function() {
        return user.findAll({})
        .then(sequelize.handler);
      },

      getAllUsersHasRole: function(role, profile) {
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


      findUserDetail:  function(username,profile){
        return user.findOne({
          include:[{model:profile}],
          where: {
            username: username
          }
        });
      },

      getUserByRole: function(role) {
        return user.findAll({
          attributes: ['username'],
          where: {
            userrole: role
          }
        }).then(sequelize.handler);
      },

      addNewUser: function(newUser){

        newUser.password = user.encyptPassword(newUser.password);
        return user.build(newUser).save();
      },

      deleteUser: function (users) {
        return users.destroy()
      },

      putUser: function(currentUser) {
        return user.update({
          'password': user.encyptPassword(currentUser.password),
          'userrole': currentUser.userrole,
          'userstatus': currentUser.userstatus
        },{where: {
          'username': currentUser.username
        }})
        .then(sequelize.handler);
      },

      getAllShipperWithTask: function(task, profile, order, orderstatus, tasktype, taskstatus) {
        //neu processing = true thi chi lay loai processing

        return user.findAll({
          include:[{
            model: task,
            as:'tasks',
            //required: false,
            include: [
              {
                model: order,
                attributes: ['orderid', 'storeid','pickupaddress','statusid','deliveryaddress','deliveryprovinceid',
                  'deliverydistrictid', 'deliverywardid','iscancel'],
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
                  statusid: 1
                }
              }

            ]
          },{model: profile}],
          where: {
            'userrole': 1
            //'username': 'task.shipperid'
          }
        });
      },

      getAllTaskProcessingOfShipper: function(task, profile, order, orderstatus, tasktype, taskstatus, shipperid) {
        //neu processing = true thi chi lay loai processing
        return user.findAll({
          include:[{
            model: task,
            as:'tasks',
            //required: false,
            include: [
              {
                model: order,
                attributes: ['orderid', 'storeid','pickupaddress','statusid','deliveryaddress','deliveryprovinceid',
                  'deliverydistrictid', 'deliverywardid','iscancel'],
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
                  statusid: 4
                }
              }

            ]
          },{model: profile}],
          where: {
            'userrole': 1,
            'username': shipperid
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

      updateLoginTime: function(username, loginTime) {
        return user.update({
          'logintime': loginTime
        },{where: {
          'username': username
        }})
      },

      checkTokenTime: function (username, tokenTime) {
        return user.findOne({
          where: {
            'username': username,
            'logintime': {
              $lte: tokenTime
            }
          }
        })
      },

      updateUserStatus: function(username, status) {//for ban store function
        return user.update({
          'userstatus': status
        },{where: {
          'username': username
        }})
      },
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
