/**
 * Created by Cao Khanh on 13/11/2015.
 */

module.exports = function(sequelize, DataTypes) {
  var province =  sequelize.define('province', {
    provinceid: {
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
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
    classMethods:{
      associate: function(db) {

        province.hasMany(db.district, {
          foreignKey: 'provinceid',
          constraints: false
        });    

      },
      getAllProvince: function(districtModel,wardModel) {
        return province.findAll({
           where: {
              provinceid : '01'
           },
           include: [{
            model: districtModel,
            include: [{
              model: wardModel,
            }]            
          },         
          ]
        });
      }
    }

  });
  return province;
};
