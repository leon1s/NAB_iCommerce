const Operation = require('./../Operation');
const { Op } = require("sequelize");

class SearchAllProducts extends Operation {
  constructor({ productsRepository }) {
    super();
    this.product_repository = productsRepository;
  }

  async execute(params) {
    const { SUCCESS, ERROR } = this.outputs;
    try {
      let sort = [['id', 'DESC']]
      const query = await buildQuery(params)
      if (params.sort) {
          sort = await buidSort(params.sort)
      }
      const products = await this.product_repository.getAll({
        attributes: ['id', 'name', 'branch', 'price', 'productId'],
        where: {[Op.and]: [{ deletedAt: { [Op.eq]: null }}, query]},
        order: sort ,
        offset: parseInt(params.offset) || 0,
        limit : parseInt(params.limit) || 10
      });

      this.emit(SUCCESS, products);
    } catch(error) {
      this.emit(ERROR, error);
    }
  }
}

function buildQuery(params) {
  let query = []
  Object.entries(params).forEach(([key, value]) => {
    if (key === 'name') { // support search like by name product
      query.push({ name: { [Op.like]: `%${params.name}%`} })
    } else if (key === 'offset' || key === 'limit' || 'sort') {
      return
    } else if (key === 'price') { // support range for price, simple price step + 100
      query.push({price : {[Op.between]: [parseInt(value), parseInt(value) + 100 ]}})
    } else { // the other let use filter
      let temp_dict = {}
      temp_dict[key] = value
      query.push(temp_dict)
    }
  });
  return { [Op.and] : query}
}

async function buidSort(params) {
  let sort_list = []
  for (let value of params) {
    value = await value.replace(/^\[|\]$/g, "").split(", ");
    sort_list.push(value)
  }
  return sort_list
}


SearchAllProducts.setOutputs(['SUCCESS', 'ERROR']);

module.exports = SearchAllProducts;
