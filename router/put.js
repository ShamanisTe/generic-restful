'use strict';
const path = require('path');
const extend = require('util')._extend;
const utils = require('../utils');

module.exports = (req, res, next) => {
  console.log('-- put');
  console.log(req.body);
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


  let newItem = JSON.parse(req.body);
  toReturn = toReturn.map(item => {
    if(item._id == newItem._id){
      item = extend({}, newItem);
    }
    return item;
  })
  try {
    utils.writeFileResource(resourcePath, toReturn, () => {
      res.send(201, 'ok');
    });
  } catch (e) {
    console.log(e);
  }
  return next();
};
