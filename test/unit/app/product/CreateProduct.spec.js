const { expect } = require('chai');
const CreateProduct = require('src/app/product/CreateProduct');


describe('App :: Product :: CreateProduct', () => {
  let createProduct;

  context('when product is valid', () => {
    before(() => {
      const MockProductsRepository = {
        add: (product) => Promise.resolve(product)
      }
      createProduct = new CreateProduct({
        productsRepository: MockProductsRepository
      });
    });
    it('creates the product and emits SUCCESS', (done) => {
      const productData = { name: 'New product', branch: "NAB", price: 10 };

      createProduct.on(createProduct.outputs.SUCCESS, (response) => {
        expect(response.name).to.equal('New product');
        done();
      });

      createProduct.execute(productData);
    });
  });

  context('when product is invalid', () => {
     before(() => {
       const MockProductsRepository = {
         add: () => Promise.reject(Error('ValidationError'))
       };

       createProduct = new CreateProduct({
         productsRepository: MockProductsRepository
       });
     });

     it('emits VALIDATION_ERROR with the error', (done) => {
       const productData = { name: 'New product', branch: "NAB", price: 10 };

       createProduct.on(createProduct.outputs.VALIDATION_ERROR, (response) => {
         expect(response.message).to.equal('ValidationError');
         done();
       });

       createProduct.execute(productData);
     });
   });

   context('when there is an internal error', () => {
     before(() => {
       const MockProductsRepository = {
         add: () => Promise.reject(new Error('Some Error'))
       };

       createProduct = new CreateProduct({
         productsRepository: MockProductsRepository
       });
     });

     it('emits ERROR with the error', (done) => {
       const productData = { name: 'New Pro' };

       createProduct.on(createProduct.outputs.ERROR, (response) => {
         expect(response.message).to.equal('Some Error');
         done();
       });

       createProduct.execute(productData);
     });
   });
});
