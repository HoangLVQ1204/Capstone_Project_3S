/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var managestore = sequelize.define('managestore', {
    managerid: {
      type: DataTypes.STRING,
      allowNull: false
    },
    storeid: {
      type: DataTypes.STRING,
      allowNull: false
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
            },
            getStoresOfUser: function(username){
                return managestore.findAll({
                  attributes: ['storeid'],
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
            }
        }
      }

  );

  return managestore;
};
