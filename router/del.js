'use strict';
const path = require('path');
const extend = require('util')._extend;
const utils = require('../utils');

module.exports = (req, res, next) => {
  console.log('-- del');
  let resourcePath = path.join(req.projectPath, req.params[1]);
  let toReturn = null;
  try {
     toReturn = utils.getFileResourceSync(resourcePath);
  }
  catch (e) {
    console.log(e);
    res.send(404, e);
    return next();
  }

  toReturn = utils.delOne(toReturn, req.params[2]);

  try {
    utils.writeFileResource(resourcePath, toReturn, () => {
      res.send(201, 'ok');
    });
  } catch (e) {
    console.log(e);
  }
  return next();
};
