const Order = require('src/domain/order/Order');

const SequelizeOrderMapper = {
  toEntity({ dataValues }) {
    const { id, username, productOrder, status } = dataValues;

    return new Order({ id, username, productOrder, status });
  },

  toDatabase(survivor) {
    const { id, username, productOrder, status } = survivor;

    return { id, username, productOrder, status};
  }
};

module.exports = SequelizeOrderMapper;
