'use strict';

function getEnvironment() {

  if(process.env.NODE_ENV) {
    return process.env.NODE_ENV;
  }

  return 'development';

}

module.exports = {
  environment: getEnvironment()
};
