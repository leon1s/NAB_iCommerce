const { expect } = require('chai');
const GetAllProducts = require('src/app/product/GetAllProducts');

describe('App :: Product :: GetAllProducts', () => {
  let getAllProducts;

  context('when query is successful', () => {
    before(() => {
      const MockProductsRepository = {
        getAll: () => Promise.resolve('Imagine all the products...'),
        count: () => Promise.resolve(10),
      };
      getAllProducts = new GetAllProducts({
        productsRepository: MockProductsRepository
      });
    });

    it('emits SUCCESS with all the products', (done) => {
      getAllProducts.on(getAllProducts.outputs.SUCCESS, (response) => {
        expect(response).to.equal('Imagine all the products...');
        done();
      });
      const productData = {limit: 10, offset:0}
      getAllProducts.execute(productData);
    });
  });

  context('when there is an internal error', () => {
    before(() => {
      const MockProductsRepository = {
        getAll: () => Promise.reject(new Error('Failed'))
      };

      getAllProducts = new GetAllProducts({
        productsRepository: MockProductsRepository
      });
    });

    it('emits ERROR with the error', (done) => {
      getAllProducts.on(getAllProducts.outputs.ERROR, (response) => {
        expect(response.message).to.equal('Failed');

        done();
      });
      const productData = {limit: 10, offset:0}
      getAllProducts.execute(productData);
    });
  });
});
