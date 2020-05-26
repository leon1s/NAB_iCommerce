'use strict';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('order', {
    username: DataTypes.STRING,
    productOrder: DataTypes.UUID,
    status: DataTypes.STRING,
    deletedAt: DataTypes.DATE
  }, {
    classMethods: {
      associate() {
        // associations can be defined here
      }
    }
  });
};
