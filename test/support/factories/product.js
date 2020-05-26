const dataFaker = require('src/infra/support/dataFaker');

module.exports = (factory, { Product }) => {
  factory.define('product', Product, {
    name: dataFaker.name()
  });
};
