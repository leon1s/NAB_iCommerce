const { expect } = require('chai');
const DeleteProduct = require('src/app/product/DeleteProduct');

describe('App :: Product :: DeleteProduct', () => {
  let deleteProduct;

  context('when Product exists', () => {
    before(() => {
      const MockProductsRepository = {
        remove: () => Promise.resolve()
      };

      deleteProduct = new DeleteProduct({
        productsRepository: MockProductsRepository
      });
    });

    it('deletes the Product and emits SUCCESS with no payload', (done) => {
      deleteProduct.on(deleteProduct.outputs.SUCCESS, (response) => {
        expect(response).to.be.undefined();
        done();
      });

      deleteProduct.execute(123);
    });
  });

  context('when the Product does not exist', () => {
    before(() => {
      const MockProductsRepository = {
        remove: () => Promise.reject(new Error('NotFoundError'))
      };

      deleteProduct = new DeleteProduct({
        productsRepository: MockProductsRepository
      });
    });

    it('emits NOT_FOUND with the error', (done) => {
      deleteProduct.on(deleteProduct.outputs.NOT_FOUND, (response) => {
        expect(response.message).to.equal('NotFoundError');
        done();
      });

      deleteProduct.execute(123);
    });
  });


  context('when there is an internal error', () => {
    before(() => {
      const MockProductsRepository = {
        remove: () => Promise.reject(new Error('Some Error'))
      };

      deleteProduct = new DeleteProduct({
        productsRepository: MockProductsRepository
      });
    });

    it('emits ERROR with the error', (done) => {
      deleteProduct.on(deleteProduct.outputs.ERROR, (response) => {
        expect(response.message).to.equal('Some Error');
        done();
      });

      deleteProduct.execute(321);
    });
  });
});
