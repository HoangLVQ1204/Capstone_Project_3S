/* jshint indent: 2 */
var moment         = require('moment');
module.exports = function(sequelize, DataTypes) {
  var generalledger =  sequelize.define('generalledger', {
    ledgerid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    adminid: {
      type: DataTypes.STRING,
      allowNull: true,
      primaryKey: true
    },
    storeid: {
      type: DataTypes.STRING,
      allowNull: true,
      primaryKey: true
    },
    amount: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    balance: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    paydate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    payfrom: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    totaldelivery: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    totalcod: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    freezeTableName: true,
    timestamps: false,
    classMethods: {
      associate: function(db) {

        generalledger.hasMany(db.order, {
          foreignKey: 'ledgerid',
          constraints: false
        });
        generalledger.belongsTo(db.store,{
          foreignKey:'storeid',
          constraints: false
        });
        generalledger.belongsTo(db.user,{
          foreignKey:'adminid',
          constraints: false
        });
      },
      getLatestLedgerOfStore: function(storeid){
        return generalledger.findOne({
          where:{
            'storeid':storeid,
          }, limit: 1, order: 'payDate DESC'
        });
      },

      getLatestAutoAccountDate: function(){
        return generalledger.findOne({
          where:{
            $and: [{'amount':  null}, {'payfrom': 3}]
          }, limit: 1, order: 'payDate DESC'
        });
      },

      getLatestAutoAccountWithStoreID: function(storeid){
        return generalledger.findOne({
          where:{
            'storeid': storeid,
            $and: [{'amount':  null}, {'payfrom': 3}]
          }, limit: 1, order: 'payDate DESC'
        }).then(sequelize.handler);
      },

      //post new ledger to database
      postNewLedger: function(newLedger){
        return generalledger.build({
              'storeid': newLedger.storeid,
              'adminid': newLedger.adminid,
              'amount': newLedger.amount,
              'balance': newLedger.balance,
              'paydate': newLedger.paydate,
              'payfrom': newLedger.payfrom,
              'totaldelivery': newLedger.totaldelivery,
              'totalcod': newLedger.totalcod,
              'note': newLedger.note
        }).save().then(sequelize.handler);
      },

      getAllLedger: function (store, order) {
        return generalledger.findAll({
          include:[{
            model: store
            //as: 'store'
          },
            {
              model: order
             // as: 'order'
            }]
        })
      },

      getLedgerOfStore: function (store, storeid, perioddate, latestAutoDate) {
        //console.log(moment(perioddate).subtract(10, 'days').calendar());
          if (perioddate != 'null')
          {
            return generalledger.findAll({
              include:[{
                model: store
                //as: 'store'
              }],where: {
                'storeid': storeid,
                'paydate':  latestAutoDate
              }
            })
          }
          else return generalledger.findAll({
            include:[{
              model: store
              //as: 'store'
            }],where: {
              'storeid': storeid,
              'paydate': {
                gt: latestAutoDate
              }
            }
          })
      },
      storeGetAllLedger: function (storeid) {
        return generalledger.findAll({
          where: {
            'storeid': storeid
          }
        }).then(sequelize.handler);
      }
  }
});
  return generalledger;
};
