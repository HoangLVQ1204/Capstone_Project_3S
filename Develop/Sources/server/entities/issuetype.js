/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var issuetype =  sequelize.define('issuetype', {
    typeid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    categoryid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    typename: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    freezeTableName: true,
    timestamps: false,
    classMethods: {
      associate: function(db) {
        issuetype.belongsTo(db.issuecategory, {
          foreignKey: 'categoryid',
          constraints: false
        });
      }
    }
  });
  return issuetype;
};
