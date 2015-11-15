/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var managestore = sequelize.define('managestore', {
      managerid: {
          type: DataTypes.STRING,
          allowNull: false,
          primaryKey: true
      },
      storeid: {
          type: DataTypes.STRING,
          allowNull: false,
          primaryKey: true
      }
  }, {
        freezeTableName: true,
        timestamps: false,
        instanceMethods: {

        },
        classMethods: {
            associate: function(db){
                managestore.belongsTo(db.user,{
                    foreignKey: 'managerid'
                });
                managestore.belongsTo(db.store,{
                    foreignKey: 'storeid'
                });
            },
            getStoresOfUser: function(username,store){
                return managestore.findAll({
                  include:[{
                      model: store,
                      attributes: ['storeid','latitude','longitude']
                  }],
                  where: {
                    managerid: username
                  }
                })
            },
            getAllData: function(db){
                return managestore.findAll({
                    include: [{
                        model: db.user
                    }]
                })
            },
            getUsersByStoreID: function (storeID){
                return managestore.findAll({
                    attributes: [['managerid','manager']],
                    where: {
                        storeid: storeID
                    }
                })
            }
        }
      }

  );

  return managestore;
};
