/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var issuecategory = sequelize.define('issuecategory', {
    categoryid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    categoryname: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    freezeTableName: true,
    timestamps: false,
    classMethods: {
      associate: function(db) {
        issuecategory.hasMany(db.issuetype, {
          foreignKey: 'categoryid',
          constraints: false
        });
      }
    }
  });
  return issuecategory
};
