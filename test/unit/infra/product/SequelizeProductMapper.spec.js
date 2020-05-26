const { expect } = require('chai');
const Product = require('src/domain/product/Product');
const SequelizeProductMapper = require('src/infra/repository/product/SequelizeProductMapper');

describe('Infra :: Product :: SequelizeProductMapper', () => {
  describe('.toEntity', () => {
    beforeEach(() => {
      it('returns product instance with passed attributes', () => {
        const mockedSequelizeProduct = {
          dataValues: {
            id: 1,
            name: 'The Name'
          }
        };

        const entity = SequelizeProductMapper.toEntity(mockedSequelizeProduct);

        expect(entity).to.be.instanceOf(Product);
        expect(entity.id).to.equal(1);
        expect(entity.name).to.equal('The Name');
      });
    })
  });

  describe('.toDatabase', () => {
    beforeEach(() => {
      it('returns product object prepared to be persisted', () => {
        const product = new Product({
          name: 'Some Product',
          branch: 'NAB',
          price: 10,
          productId: 'abc'
        });

        const dbProduct = SequelizeProductMapper.toDatabase(product);

        expect(dbProduct.name).to.equal('Some Product');
        expect(dbProduct).to.have.all.keys('name', 'branch', 'price', 'productId');
      });
    })
  });
});
