const { Router } = require('express');
const { inject } = require('awilix-express');
const Status = require('http-status');

const OrdersController = {
  get router() {
    const router = Router();

    router.use(inject('ordersSerializer'));


    router.post('/', inject('createOrder'), this.create);
    return router;
  },

  create(req, res, next) {
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
