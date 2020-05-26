const { Router } = require('express');
const { inject } = require('awilix-express');
const Status = require('http-status');

const OrdersController = {
  get router() {
    const router = Router();

    router.use(inject('ordersSerializer'));


    router.post('/', inject('createOrder'), this.create);
    // router.put('/:id', inject('updateProduct'), this.update);
    // router.delete('/:id', inject('deleteProduct'), this.delete);
    // router.get('/', inject('getAllProducts'), this.index);
    // router.get('/search', inject('searchAllProducts'), this.search);
    // router.get('/:id', inject('getProduct'), this.show);
    return router;
  },

  create(req, res, next) {
    console.log('here')
    const { createOrder, ordersSerializer } = req;
    const { SUCCESS, ERROR, VALIDATION_ERROR } = createOrder.outputs;

    createOrder
      .on(SUCCESS, (order) => {
        res
          .status(Status.CREATED)
          .json(ordersSerializer.serialize(order));
      })
      .on(VALIDATION_ERROR, (error) => {
        res.status(Status.BAD_REQUEST).json({
          type: 'ValidationError',
          details: error.details
        });
      })
      .on(ERROR, next);

    createOrder.execute(req.body);
  },


};

module.exports = OrdersController;
