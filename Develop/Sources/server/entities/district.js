/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var district =  sequelize.define('district', {
    districtid: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    provinceid: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
     classMethods:{
      associate: function(db) {   

        district.hasMany(db.ward, {
          foreignKey: 'districtid',
          constraints: false
        });    

      },
      getAllDistrict: function() {
        return district.findAll({});
      }
    }

  });
  return district;
};
