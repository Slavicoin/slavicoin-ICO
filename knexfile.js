
const { postgres } = require('./configuration/database/database-configuration.service');

module.exports = {

  development: postgres,
  testing: postgres,
  production: postgres

};