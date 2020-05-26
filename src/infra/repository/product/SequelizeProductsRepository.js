const ProductMapper = require('./SequelizeProductMapper');


class SequelizeProductsRepository {
  constructor({ ProductModel }) {
    this.ProductModel = ProductModel;
  }

  async getAll(...args) {
    const products = await this.ProductModel.findAll(...args);

    return products.map(ProductMapper.toEntity);
  }

  async getById(id) {
    const product = await this._getById(id);

    return ProductMapper.toEntity(product);
  }

  async add(product) {
    const { valid, errors } = product.validate();
    if(!valid) {
      const error = new Error('ValidationError');
      error.details = errors;

      throw error;
    }
    const new_product = await this.ProductModel.create(ProductMapper.toDatabase(product));
    return ProductMapper.toEntity(new_product);
  }

  async remove(id) {
    const product = await this._getById(id);

    const transaction = await this.ProductModel.sequelize.transaction();

    try {
      const updated_product = await product.update({deletedAt:new Date()}, { transaction });
      const product_entity = ProductMapper.toEntity(updated_product);

      const { valid, errors } = product_entity.validate();

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
    const product = await this._getById(id);

    const transaction = await this.ProductModel.sequelize.transaction();

    try {
      const updated_product = await product.update(newData, { transaction });
      const product_entity = ProductMapper.toEntity(updated_product);

      const { valid, errors } = product_entity.validate();

      if(!valid) {
        const error = new Error('ValidationError');
        error.details = errors;

        throw error;
      }

      await transaction.commit();

      return product_entity;
    } catch(error) {
      await transaction.rollback();

      throw error;
    }
  }

  async count() {
    return await this.ProductModel.count();
  }

  // Private

  async _getById(id) {
    try {
      return await this.ProductModel.findById(id, { rejectOnEmpty: true });
    } catch(error) {
      if(error.name === 'SequelizeEmptyResultError') {
        const notFoundError = new Error('NotFoundError');
        notFoundError.details = `Product with id ${id} can't be found.`;

        throw notFoundError;
      }

      throw error;
    }
  }
}

module.exports = SequelizeProductsRepository;
