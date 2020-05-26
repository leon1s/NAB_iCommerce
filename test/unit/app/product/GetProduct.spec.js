const { expect } = require('chai');
const GetProduct = require('src/app/product/GetProduct');

describe('App :: Product :: GetProduct', () => {
  let getProduct;

  context('when Product exists', () => {
    beforeEach(() => {
      const MockProductsRepository = {
        getById: (id) => Promise.resolve({
          name: 'The Product',
          branch: 'NAB',
          price: 10,
          productId: "ef396c86-e602-4983-88db-b4055c656f27"
        })
      };

      getProduct = new GetProduct({
        productsRepository: MockProductsRepository
      });
    });

    it('emits SUCCESS with the Product', (done) => {
      getProduct.on(getProduct.outputs.SUCCESS, (product) => {
        expect(product.name).to.equal('The Product');
        expect(product.branch).to.equal('NAB');
        expect(product.price).to.equal(10)
        done();
      });

      getProduct.execute(123);
    });
  });

  context('when Product does not exist', () => {
    beforeEach(() => {
      const MockProductsRepository = {
        getById: () => Promise.reject({
          details: 'Product with id 123 can\'t be found.'
        })
      };

      getProduct = new GetProduct({
        productsRepository: MockProductsRepository
      });
    });

    it('emits NOT_FOUND with the error', (done) => {
      getProduct.on(getProduct.outputs.NOT_FOUND, (error) => {
        expect(error.details).to.equal('Product with id 123 can\'t be found.');
        done();
      });

      getProduct.execute(123);
    });
  });
});
