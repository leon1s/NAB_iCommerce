const Product = require('src/domain/product/Product');

const SequelizeProductMapper = {
  toEntity({ dataValues }) {
    const { id, name, branch, price, productId } = dataValues;

    return new Product({ id, name, branch, price, productId });
  },

  toDatabase(survivor) {
    const { name, branch, price, productId } = survivor;

    return { name, branch, price, productId };
  }
};

module.exports = SequelizeProductMapper;
