/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var ward =  sequelize.define('ward', {
    wardid: {
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
    location: {
      type: DataTypes.STRING,
      allowNull: false
    },
    districtid: {
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
        ward.belongsTo(db.district, {
          foreignKey: 'districtid',
          constraints: false
        });
      },
      getAllWard: function() {
        return ward.findAll({});
      }
    }

  });
  return ward;
};
