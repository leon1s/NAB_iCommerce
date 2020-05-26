const Operation = require('./../Operation');
const Order = require('../../domain/order/Order');

class CreateOrder extends Operation {
  constructor({ ordersRepository }) {
    super();
    this.order_repository = ordersRepository;
  }

  async execute(order_data) {
    const { SUCCESS, ERROR, VALIDATION_ERROR } = this.outputs;
    const order = new Order(order_data);
    try {
      const new_product = await this.order_repository.add(order);
      this.emit(SUCCESS, new_product);
    } catch(error) {
      if(error.message === 'ValidationError') {
        return this.emit(VALIDATION_ERROR, error);
      }

      this.emit(ERROR, error);
    }
  }
}

CreateOrder.setOutputs(['SUCCESS', 'ERROR', 'VALIDATION_ERROR']);

module.exports = CreateOrder;
