const { attributes } = require('structure');

const Product = attributes({
  id: Number,
  productId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  branch:{
    type: String,
    required: true
  },
  deletedAt: {
    type: Date
  }
})(class Product {
});

module.exports = Product;
