/* jshint indent: 2 */



module.exports = function(sequelize, DataTypes) {
  var store = sequelize.define('store', {
    storeid: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    addresscoordination: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    phonenumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  },{
    freezeTableName: true,
        timestamps: false,
        classMethods: {
      getAllStores: function() {
        return store.findAll({});
      },

      getOneStore: function(storeid){
        return store.findOne({
          where:{
            'storeid':storeid,
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

                }, limit: 1, order: 'payDate DESC'
              }]
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
