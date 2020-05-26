const OrderMapper = require('./SequelizeOrderMapper');


class SequelizeOrderRepository {
  constructor({ OrderModel }) {
    this.OrderModel = OrderModel;
  }

  async add(order) {
    const { valid, errors } = order.validate();
    if(!valid) {
      const error = new Error('ValidationError');
      error.details = errors;

      throw error;
    }
    const new_order = await this.OrderModel.create(OrderMapper.toDatabase(order));
    return OrderMapper.toEntity(new_order);
  }

}

module.exports = SequelizeOrderRepository;
