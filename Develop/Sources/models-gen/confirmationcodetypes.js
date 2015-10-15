/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('confirmationcodetypes', { 
    typeid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    codetype: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    freezeTableName: true,
    timestamps: false
  });
};
