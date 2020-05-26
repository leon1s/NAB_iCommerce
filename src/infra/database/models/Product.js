'use strict';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('product', {
    name: DataTypes.STRING,
    productId: DataTypes.UUID,
    branch: DataTypes.STRING,
    price: DataTypes.INTEGER,
    deletedAt: DataTypes.DATE
  }, {
    classMethods: {
      associate() {
        // associations can be defined here
      }
    }
  });
};
