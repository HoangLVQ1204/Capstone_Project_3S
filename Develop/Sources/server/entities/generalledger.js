/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var generalledger = sequelize.define('generalledger', {
    ledgerid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    adminid: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    storeid: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    amount: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    balance: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    paydate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    payfrom: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  },{
    freezeTableName: true,
    timestamps: false,
    classMethods: {

      getBalance: function(storeid){
        return generalledger.findOne({
          where:{
            'storeid':storeid,
          }, limit: 1, order: 'payDate DESC'
        });
      }

      //postOneStore: function(newStore){
      //  return store.build(newStore).save();
      //},
      //
      //deleteStore: function (stores) {
      //  return stores.destroy()
      //},
      //
      //putStore: function(currentStore){
      //  return currentStore.save();
      //}
    }
  });
  return generalledger;
};
