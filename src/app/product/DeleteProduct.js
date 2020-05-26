const Operation = require('./../Operation');

class DeleteProduct extends Operation {
  constructor({ productsRepository }) {
    super();
    this.product_repository = productsRepository;
  }

  async execute(productId) {
    const { SUCCESS, ERROR, NOT_FOUND } = this.outputs;

    try {
      await this.product_repository.remove(productId);
      this.emit(SUCCESS);
    } catch(error) {
      if(error.message === 'NotFoundError') {
        return this.emit(NOT_FOUND, error);
      }

      this.emit(ERROR, error);
    }
  }
}

DeleteProduct.setOutputs(['SUCCESS', 'ERROR', 'NOT_FOUND']);

module.exports = DeleteProduct;
