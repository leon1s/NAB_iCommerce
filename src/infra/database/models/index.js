const { ModelsLoader } = require('src/infra/sequelize');
const Sequelize = require('sequelize');
const { db: config } = require('config');

if(config) {
  const sequelize = new Sequelize(config);
  sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });
  module.exports = ModelsLoader.load({
    sequelize,
    baseFolder: __dirname
  });


} else {
  /* eslint-disable no-console */
  console.error('Database configuration not found, disabling database.');
  /* eslint-enable no-console */
}

