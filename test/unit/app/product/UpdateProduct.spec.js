const { expect } = require('chai');
const UpdateProduct = require('src/app/product/UpdateProduct');

describe('App :: Product :: UpdateProduct', () => {
  let updateProduct;

  context('when product exists', () => {
    context('when data is valid', () => {
      before(() => {
        const MockProductsRepository = {
          update: (id, data) => Promise.resolve(data)
        };

        updateProduct = new UpdateProduct({
          productsRepository: MockProductsRepository
        });
      });

      it('updates the product and emits SUCCESS', (done) => {
        const productData = { name: 'Updated Product' };

        updateProduct.on(updateProduct.outputs.SUCCESS, (response) => {
          expect(response.name).to.equal('Updated Product');
          done();
        });

        updateProduct.execute(123, productData);
      });
    });

    context('when data is invalid', () => {
      before(() => {
        const MockProductsRepository = {
          update: () => Promise.reject(Error('ValidationError'))
        };

        updateProduct = new UpdateProduct({
          productsRepository: MockProductsRepository
        });
      });

      it('emits VALIDATION_ERROR with the error', (done) => {
        const productData = { name: 'New Product' };

        updateProduct.on(updateProduct.outputs.VALIDATION_ERROR, (response) => {
          expect(response.message).to.equal('ValidationError');
          done();
        });

        updateProduct.execute(321, productData);
      });
    });
  });

  context('when the product does not exist', () => {
    before(() => {
      const MockProductsRepository = {
        update: () => Promise.reject(new Error('NotFoundError'))
      };

      updateProduct = new UpdateProduct({
        productsRepository: MockProductsRepository
      });
    });

    it('emits NOT_FOUND with the error', (done) => {
      const productData = { name: 'New Product' };

      updateProduct.on(updateProduct.outputs.NOT_FOUND, (response) => {
        expect(response.message).to.equal('NotFoundError');
        done();
      });

      updateProduct.execute(123, productData);
    });
  });


  context('when there is an internal error', () => {
    before(() => {
      const MockProductsRepository = {
        update: () => Promise.reject(new Error('Some Error'))
      };

      updateProduct = new UpdateProduct({
        productsRepository: MockProductsRepository
      });
    });

    it('emits ERROR with the error', (done) => {
      const productData = { name: 'New Product' };

      updateProduct.on(updateProduct.outputs.ERROR, (response) => {
        expect(response.message).to.equal('Some Error');
        done();
      });

      updateProduct.execute(321, productData);
    });
  });
});
