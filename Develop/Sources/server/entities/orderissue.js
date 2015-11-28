/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var orderissue = sequelize.define('orderissue', {
    issueid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    orderid: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    }
  }, {
    freezeTableName: true,
    timestamps: false,
    classMethods: {
      associate: function(db) {
        orderissue.belongsTo(db.order, {
          foreignKey: 'orderid',
          constraints: false
        });


      },
      createOrderIssue: function(newOrderIssue) {
        return orderissue.build(newOrderIssue).save();
      },

      getOrderOfIssue: function(issueid) {
        return orderissue.findAll({
          attribute: 'orderid',

          where: {
            'issueid': issueid
          }
        });
      },
    }
  });
  return orderissue;
};
