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

        },

      getAllStores: function() {
        return store.findAll({});
      },

      getOneStore: function(storeid){
        return store.findOne({
          where:{
            'storeid':storeid
          }
        });
      },

      postOneStore: function(newStore){
        return store.build(newStore).save();
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

        getStoreLatestTotal: function (generalledger, bannedhistorylog){
            return store.findAll({
                include: [{
                    model: generalledger,
                    where: {
                        $and: [{'totaldelivery': {$ne: null}}, {'totalcod': {$ne: null}}]
                    },limit: 1, order: 'payDate DESC'
                },{
                    model: bannedhistorylog,

                    as: 'ban',

                    where: {
                    }, limit: 1, order: 'bannedtime DESC'

                }]
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
            }
          //,

      //getStoreLedger: function(generalledger, storeid){
      //  //generalledger.belongsTo(store);
      //
      //  return store.findAll({where:{'storeid':storeid},include: [generalledger]});
      //}

    }
    });
    return store;
};
