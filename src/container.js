const { createContainer, asClass, asFunction, asValue } = require('awilix');
const { scopePerRequest } = require('awilix-express');

const config = require('../config');
const Application = require('./app/Application');
const {
  CreateProduct,
  GetAllProducts,
  SearchAllProducts,
  GetProduct,
  UpdateProduct,
  DeleteProduct
} = require('./app/product');

const {
  CreateOrder,
} = require('./app/order');

const ProductsSerializer = require('./interfaces/http/product/ProductsSerializer');
const OrdersSerializer = require('./interfaces/http/order/OrdersSerializer')

const Server = require('./interfaces/http/Server');
const router = require('./interfaces/http/router');
const loggerMiddleware = require('./interfaces/http/logging/loggerMiddleware');
const errorHandler = require('./interfaces/http/errors/errorHandler');
const devErrorHandler = require('./interfaces/http/errors/devErrorHandler');

const logger = require('./infra/logging/logger');
const SequelizeProductsRepository = require('./infra/repository/product/SequelizeProductsRepository');
const SequelizeOrdersRepository = require('./infra/repository/order/SequelizeOrderRepository');
const { database, Product: ProductModel, Order: OrderModel } = require('./infra/database/models');

const container = createContainer();

// System
container
  .register({
    app: asClass(Application).singleton(),
    server: asClass(Server).singleton()
  })
  .register({
    router: asFunction(router).singleton(),
    logger: asFunction(logger).singleton()
  })
  .register({
    config: asValue(config)
  });

// Middlewares
container
  .register({
    loggerMiddleware: asFunction(loggerMiddleware).singleton()
  })
  .register({
    containerMiddleware: asValue(scopePerRequest(container)),
    errorHandler: asValue(config.production ? errorHandler : devErrorHandler)
  });

// Repositories
container.register({
  productsRepository: asClass(SequelizeProductsRepository).singleton(),
  ordersRepository: asClass(SequelizeOrdersRepository).singleton()
});

// Database
container.register({
  database: asValue(database),
  ProductModel: asValue(ProductModel),
  OrderModel: asValue(OrderModel)
});

// Operations
container.register({
  createProduct: asClass(CreateProduct),
  getAllProducts: asClass(GetAllProducts),
  searchAllProducts: asClass(SearchAllProducts),
  getProduct: asClass(GetProduct),
  updateProduct: asClass(UpdateProduct),
  deleteProduct: asClass(DeleteProduct),

});
// Operations
container.register({
  createOrder: asClass(CreateOrder),
});

// Serializers
container.register({
  productsSerializer: asValue(ProductsSerializer),
  ordersSerializer: asValue(OrdersSerializer)
});

module.exports = container;
