/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    var store = sequelize.define('store', {
        storeid: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        address: {
            type: DataTypes.STRING,
            allowNull: true
        },
        latitude: {
            type: DataTypes.STRING,
            allowNull: true
        },
        longitude: {
            type: DataTypes.STRING,
            allowNull: true
        },
        phonenumber: {
            type: DataTypes.STRING,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true
        },
        avatar: {
            type: DataTypes.STRING,
            allowNull: true
        },
        registereddate: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        freezeTableName: true,
        timestamps: false,
        classMethods: {
        associate: function(db) {

            store.hasMany(db.bannedhistorylog, {
                foreignKey: 'storeid',
                as: 'ban',
                constraints: false
            });

            store.hasMany(db.managestore, {
                foreignKey: 'storeid',
                constraints: false
            });

            store.hasMany(db.generalledger,  {
                foreignKey : 'storeid'
            });
        },

          getAllStores: function() {
            return store.findAll({});
          },

          getOneStore: function(storeid){
            return store.findOne({
              where:{
                'storeid':storeid
              }
            }).then(function (store) {
                return store;
            }, function (err) {
                throw err;
            });
          },

          postOneStore: function(newStore){
            return store.build(newStore).save().then(function (store) {
                return store;
            }).then(sequelize.handler);
          },

          deleteStore: function (stores) {
            return stores.destroy()
          },

          putStore: function(currentStore){
            return currentStore.save();
          },


          getAllStoreLedger: function(generalledger){
            //generalledger.belongsTo(store);

                return store.findAll({
                  include: [{
                    model: generalledger,
                    where: {
                        $and: [{'totaldelivery': null}, {'totalcod': null}]
                    }, limit: 1, order: 'payDate DESC'
                  }
                  ]
                });
          },

          getAllStoreWithLedger: function (generalledger, bannedhistorylog, managestore, user){
                return store.findAll({
                    include: [{
                        model: generalledger,
                        where: {
                            'payfrom': 3
                        },limit: 1, order: 'payDate DESC'
                    },{
                        model: bannedhistorylog,
                        as: 'ban',
                        where: {
                        }, limit: 1, order: 'bannedtime DESC'
                    },{
                        model:managestore,
                        include: {
                            model: user,
                            attributes: ['userstatus'],
                            where: {
                                //'userstatus': [2,3]
                            }
                        }
                    }],

                });
            },

            //KhanhKC
          getListStoreName: function(liststoreid){
                    return store.findAll({
                        attributes: ['storeid','name','address','phonenumber'],
                        where:{
                            'storeid': {
                                $in: liststoreid
                            }
                        }
                    });
                },
              //,

          getStoreDetail: function(storeid, managestore, user, profile){
                    return store.findOne({
                        include: {
                            model: managestore,
                            attributes: ['storeid'],
                            include: {
                                model: user,
                                attributes: ['username'],
                                include: {model: profile}
                            }
                        },
                        where:{
                            'storeid':storeid
                        }
                    }).then(sequelize.handler);
                },


                getAllInactiveStore: function(managestore, user, profile) {
                    return store.findAll({
                        include:[{
                            model: managestore,
                            include: {
                                model: user,
                                include: {model: profile},
                                where: {
                                    'userstatus': 1
                                }

                            }
                        }]
                    });
                },

                adminGetAllStoreNameAndStoreiD: function(){
                    return store.findAll({
                        attributes: ['storeid','name']                        
                    });
                }
        }
    });
    return store;
};
