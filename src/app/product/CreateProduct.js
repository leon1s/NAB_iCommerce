const Operation = require('./../Operation');
const Product = require('../../domain/product/Product');
const { v4: uuidv4 } = require('uuid');

class CreateProduct extends Operation {
  constructor({ productsRepository }) {
    super();
    this.product_repository = productsRepository;
  }

  async execute(product_data) {
    const { SUCCESS, ERROR, VALIDATION_ERROR } = this.outputs;
    product_data.productId = uuidv4();
    const product = new Product(product_data);
    try {
      const new_product = await this.product_repository.add(product);
      this.emit(SUCCESS, new_product);
    } catch(error) {
      if(error.message === 'ValidationError') {
        return this.emit(VALIDATION_ERROR, error);
      }

      this.emit(ERROR, error);
    }
  }
}

CreateProduct.setOutputs(['SUCCESS', 'ERROR', 'VALIDATION_ERROR']);

module.exports = CreateProduct;
