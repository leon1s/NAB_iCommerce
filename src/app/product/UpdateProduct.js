const Operation = require('./../Operation');

class UpdateProduct extends Operation {
  constructor({ productsRepository }) {
    super();
    this.product_repository = productsRepository;
  }

  async execute(productId, productData) {
    const {
      SUCCESS, NOT_FOUND, VALIDATION_ERROR, ERROR
    } = this.outputs;

    try {
      const product = await this.product_repository.update(productId, productData);
      this.emit(SUCCESS, product);
    } catch(error) {
      switch(error.message) {
      case 'ValidationError':
        return this.emit(VALIDATION_ERROR, error);
      case 'NotFoundError':
        return this.emit(NOT_FOUND, error);
      default:
        this.emit(ERROR, error);
      }
    }
  }
}

UpdateProduct.setOutputs(['SUCCESS', 'NOT_FOUND', 'VALIDATION_ERROR', 'ERROR']);

module.exports = UpdateProduct;
