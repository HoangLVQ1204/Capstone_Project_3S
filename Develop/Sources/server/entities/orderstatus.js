/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var orderstatus =  sequelize.define('orderstatus', {
    statusid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    statusname: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nextAction: {
      type: DataTypes.STRING,
      allowNull: true
    }

  }, {
    freezeTableName: true,
    timestamps: false,
    classMethods: {
      associate: function (db) {
        orderstatus.hasMany(db.order, {
          foreignKey: 'statusid',
          constraints: false
        });
      },
      getAllStatus: function(){
        return orderstatus.findAll({

        })
      }
    }
  });
  return orderstatus;
};
