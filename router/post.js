'use strict';
const path = require('path');
const extend = require('util')._extend;
const utils = require('../utils');

module.exports = (req, res, next) => {
  console.log('-- post');
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
  newItem._id = String(toReturn.length + 1);
  toReturn.push(newItem);
  try {
    utils.writeFileResource(resourcePath, toReturn, () => {
      res.send(201, 'ok');
    });
  } catch (e) {
    console.log(e);
  }
  return next();
};
