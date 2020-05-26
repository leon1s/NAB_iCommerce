const OrderMapper = require('./SequelizeOrderMapper');


class SequelizeOrderRepository {
  constructor({ OrderModel }) {
    this.OrderModel = OrderModel;
  }

  async getAll(...args) {
    const orders = await this.OrderModel.findAll(...args);

    return orders.map(OrderMapper.toEntity);
  }

  async getById(id) {
    const order = await this._getById(id);

    return OrderMapper.toEntity(order);
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

  async remove(id) {
    const order = await this._getById(id);

    const transaction = await this.OrderModel.sequelize.transaction();

    try {
      const updated_order = await order.update({deletedAt:new Date()}, { transaction });
      const order_entity = OrderMapper.toEntity(updated_order);

      const { valid, errors } = order_entity.validate();

      if(!valid) {
        const error = new Error('ValidationError');
        error.details = errors;

        throw error;
      }

      await transaction.commit();

      return;
    } catch(error) {
      await transaction.rollback();

      throw error;
    }
  }

  async update(id, newData) {
    const order = await this._getById(id);

    const transaction = await this.OrderModel.sequelize.transaction();

    try {
      const updated_order = await order.update(newData, { transaction });
      const order_entity = OrderMapper.toEntity(updated_order);

      const { valid, errors } = order_entity.validate();

      if(!valid) {
        const error = new Error('ValidationError');
        error.details = errors;

        throw error;
      }

      await transaction.commit();

      return order_entity;
    } catch(error) {
      await transaction.rollback();

      throw error;
    }
  }

  async count() {
    return await this.OrderModel.count();
  }

  // Private

  async _getById(id) {
    try {
      return await this.OrderModel.findById(id, { rejectOnEmpty: true });
    } catch(error) {
      if(error.name === 'SequelizeEmptyResultError') {
        const notFoundError = new Error('NotFoundError');
        notFoundError.details = `order with id ${id} can't be found.`;

        throw notFoundError;
      }

      throw error;
    }
  }
}

module.exports = SequelizeOrderRepository;
