'use strict';
const path = require('path');
const extend = require('util')._extend;
const utils = require('../utils');

module.exports = (req, res, next) => {
    console.log('-- get');
    let resourcePath = path.join(req.projectPath, req.params[1]);
    let toReturn = null;
    try {
       toReturn = utils.getFileResourceSync(resourcePath);
    }
    catch (e) {
      console.log(e);
      res.send(200, []);
      return next();
    }
    if(req.params[2]){
      toReturn = toReturn.filter(item => item._id === req.params[2]);
    }
    if(req.filters && Object.keys(req.filters).length){
      for (let key in req.filters) {
        let value = req.filters[key];
        toReturn = toReturn.filter(item => item[key] === value);
      }
    }
    try {
      toReturn = utils.populateDataFromOtherResource(toReturn, req.projectPath);
    } catch (e) {
      console.log(e);
    }

    res.send(200, toReturn);
};
