const Operation = require('./../Operation');
const { Op } = require("sequelize");

class GetAllProducts extends Operation {
  constructor({ productsRepository }) {
    super();
    this.product_repository = productsRepository;
  }

  async execute(params) {
    const { SUCCESS, ERROR } = this.outputs;
    try {
      const products = await this.product_repository.getAll({
        attributes: ['id', 'name', 'branch', 'price', 'productId'],
        where : { deletedAt: { [Op.eq]: null }},
        order:[
          ["id","DESC"]
        ],
        offset: parseInt(params.offset) || 0,
        limit : parseInt(params.limit) || 10
      });
      const total = await this.product_repository.count()
      this.emit(SUCCESS, products, total);
    } catch(error) {
      this.emit(ERROR, error);
    }
  }
}

GetAllProducts.setOutputs(['SUCCESS', 'ERROR']);

module.exports = GetAllProducts;
