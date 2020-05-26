const { expect } = require('chai');
const SearchAllProducts = require('src/app/product/SearchAllProducts');

describe('App :: Product :: SearchAllProducts', () => {
  let searchAllProducts;

  context('when query is successful', () => {
    before(() => {
      const MockProductsRepository = {
        getAll: () => Promise.resolve('Imagine all the products...'),
      };
      searchAllProducts = new SearchAllProducts({
        productsRepository: MockProductsRepository
      });
    });

    it('emits SUCCESS with all the products', (done) => {
      searchAllProducts.on(searchAllProducts.outputs.SUCCESS, (response) => {
        expect(response).to.equal('Imagine all the products...');
        done();
      });
      const productData = {name:'ngoc', limit: 10, offset:0}
      searchAllProducts.execute(productData);
    });
  });

  context('when there is an internal error', () => {
    before(() => {
      const MockProductsRepository = {
        getAll: () => Promise.reject(new Error('Failed'))
      };

      searchAllProducts = new SearchAllProducts({
        productsRepository: MockProductsRepository
      });
    });

    it('emits ERROR with the error', (done) => {
      searchAllProducts.on(searchAllProducts.outputs.ERROR, (response) => {
        expect(response.message).to.equal('Failed');

        done();
      });
      const productData = {limit: 10, offset:0}
      searchAllProducts.execute(productData);
    });
  });
});
