const OrdersSerializer = {
  serialize({ id, username, status, productOrder }) {
    return {
      id,
      username,
      status,
      productOrder
    };
  }
};

module.exports = OrdersSerializer;
