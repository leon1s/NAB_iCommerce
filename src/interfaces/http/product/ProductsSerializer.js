const ProductsSerializer = {
  serialize({ id, name, branch, price, productId }) {
    return {
      id,
      name,
      branch,
      price,
      productId
    };
  }
};

module.exports = ProductsSerializer;
