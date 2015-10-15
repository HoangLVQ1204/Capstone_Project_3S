/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ordertypes', { 
    typeid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    typename: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    freezeTableName: true,
    timestamps: false
  });
};
