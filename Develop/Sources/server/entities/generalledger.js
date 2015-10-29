/* jshint indent: 2 */

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
            $and: [{'amount':  null}, {'payfrom': null}]
          }, limit: 1, order: 'payDate DESC'
        });
      },

      getLatestAutoAccountWithStoreID: function(storeid){
        return generalledger.findOne({
          where:{
            'storeid': storeid,
            $and: [{'amount':  null}, {'payfrom': null}]
          }, limit: 1, order: 'payDate DESC'
        });
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
        }).save();
      }
  }
});
  return generalledger;
};
