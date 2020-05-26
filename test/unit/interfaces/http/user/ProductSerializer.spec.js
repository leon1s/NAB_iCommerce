const { expect } = require('chai');
const ProductSerializer = require('src/interfaces/http/product/ProductsSerializer');
const Product = require('src/domain/product/Product');

describe('Interfaces :: HTTP :: product :: ProductSerializer', () => {
  it('returns id and name', () => {
    const serializedProduct = ProductSerializer.serialize({
      id: 123,
      name: 'The product',
      branch: 'NAB',
      price: 10,
      productId: "abc"
    });

    expect(serializedProduct).to.eql({
      id: 123,
      name: 'The product',
      branch: 'NAB',
      price: 10,
      productId: "abc"
    });
  });

  it('ignores extra attributes', () => {
    const serializedProduct = ProductSerializer.serialize({
      id: 321,
      name: 'The product',
      branch: 'NAB',
      price: 10,
      productId: "abc",
      unknown: 'Hello!'
    });

    expect(serializedProduct).to.eql({
      id: 321,
      branch: 'NAB',
      price: 10,
      productId: "abc",
      name: 'The product'
    });
  });

  it('is able to serialize product entity instances', () => {
    const product = new Product({ id: 1, name: 'product :)', branch: 'NAB', price: 10, productId: "abc" });
    const serializedProduct = ProductSerializer.serialize(product);

    expect(serializedProduct).to.eql({
      id: 1,
      name: 'product :)',
      branch: 'NAB',
      price: 10,
      productId: "abc"
    });
  });
});
