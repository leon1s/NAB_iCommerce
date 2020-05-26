const { Router } = require('express');
const { inject } = require('awilix-express');
const Status = require('http-status');

const ProductsController = {
  get router() {
    const router = Router();

    router.use(inject('productsSerializer'));

    router.get('/', inject('getAllProducts'), this.index);
    router.get('/search', inject('searchAllProducts'), this.search);
    router.get('/:id', inject('getProduct'), this.show);
    router.post('/', inject('createProduct'), this.create);
    router.put('/:id', inject('updateProduct'), this.update);
    router.delete('/:id', inject('deleteProduct'), this.delete);

    return router;
  },

  show(req, res, next) {
    const { getProduct, productsSerializer } = req;

    const { SUCCESS, ERROR, NOT_FOUND } = getProduct.outputs;

    getProduct
        .on(SUCCESS, (product) => {
          res
              .status(Status.OK)
              .json(productsSerializer.serialize(product));
        })
        .on(NOT_FOUND, (error) => {
          res.status(Status.NOT_FOUND).json({
            type: 'NotFoundError',
            details: error.details
          });
        })
        .on(ERROR, next);

    getProduct.execute(Number(req.params.id));
  },

  index(req, res, next) {
    const { getAllProducts, productsSerializer } = req;
    const { SUCCESS, ERROR } = getAllProducts.outputs;
    getAllProducts
        .on(SUCCESS, (product, total) => {
          res
              .status(Status.OK)
              .json({data: product.map(productsSerializer.serialize), total: total})
        })
        .on(ERROR, next);

    getAllProducts.execute(req.query);
  },

  search(req, res, next) {
    const { searchAllProducts, productsSerializer } = req;
    const { SUCCESS, ERROR } = searchAllProducts.outputs;
    searchAllProducts
        .on(SUCCESS, (product) => {
          res
              .status(Status.OK)
              .json(product.map(productsSerializer.serialize));
        })
        .on(ERROR, next);

    searchAllProducts.execute(req.query);
  },

  create(req, res, next) {
    const { createProduct, productsSerializer } = req;
    const { SUCCESS, ERROR, VALIDATION_ERROR } = createProduct.outputs;

    createProduct
      .on(SUCCESS, (product) => {
        res
          .status(Status.CREATED)
          .json(productsSerializer.serialize(product));
      })
      .on(VALIDATION_ERROR, (error) => {
        res.status(Status.BAD_REQUEST).json({
          type: 'ValidationError',
          details: error.details
        });
      })
      .on(ERROR, next);

    createProduct.execute(req.body);
  },

  delete(req, res, next) {
    const { deleteProduct } = req;
    const { SUCCESS, ERROR,  NOT_FOUND } = deleteProduct.outputs;

    deleteProduct
        .on(SUCCESS, () => {
          res.status(Status.ACCEPTED).end();
        })
        .on(NOT_FOUND, (error) => {
          res.status(Status.NOT_FOUND).json({
            type: 'NotFoundError',
            details: error.details
          });
        })
        .on(ERROR, next);

    deleteProduct.execute(Number(req.params.id));
  },

  update(req, res, next) {
    const { updateProduct, productsSerializer } = req;
    const { SUCCESS, ERROR, VALIDATION_ERROR, NOT_FOUND } = updateProduct.outputs;

    updateProduct
        .on(SUCCESS, (product) => {
          res
              .status(Status.ACCEPTED)
              .json(productsSerializer.serialize(product));
        })
        .on(VALIDATION_ERROR, (error) => {
          res.status(Status.BAD_REQUEST).json({
            type: 'ValidationError',
            details: error.details
          });
        })
        .on(NOT_FOUND, (error) => {
          res.status(Status.NOT_FOUND).json({
            type: 'NotFoundError',
            details: error.details
          });
        })
        .on(ERROR, next);

    updateProduct.execute(Number(req.params.id), req.body);
  },

};

module.exports = ProductsController;
