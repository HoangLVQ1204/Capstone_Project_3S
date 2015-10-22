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

          },
          getStoresOfUser: function(username){
            return managestore.findAll({
              attributes: ['storeid'],
              where: {
                managerid: username
              }
            })
          }
        }
      }

  );

  return managestore;
};
