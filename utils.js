'use strict';

const extend = require('util')._extend;
const path = require('path');
const fs = require('fs');
const fileFormat = ".json";

/**
* @name getFileResourceSync
* @description get json file and parse content (synchronous)
* @param filepath - {String} file path to json file
* @return {Object}
*/
function getFileResourceSync(filepath){
  return JSON.parse(fs.readFileSync(filepath + fileFormat));
}

/**
* @name getFileResource
* @description get json file and parse content (asynchronous)
* @param filepath - {String} file path to json file
* @param callback - {Function} call when the file is loaded and parsed
*/
function getFileResource(filepath, callback){
  fs.readFile(filePath + fileFormat, (err, content) => {
    if(err) throw err;
    callback(JSON.parse(content));
  });
}

/**
* @name writeFileResource
* @description write json into file
* @param filepath - {String} file path to json file
* @param content - {Array|Object} json to write in file
* @param callback - {Function} call when the file is writed
*/
function writeFileResource(filePath, content, callback){
  fs.writeFile(filePath + '.json', JSON.stringify(content, null, 2), 'utf-8', (err) => {
    if(err) throw err;
    callback();
  });
}
/**
* @name findOne
* @description parse json array to find one item by _id
* @param data - {JSONArray} list to parse
* @param id - {String} object's _id to find
* @return {Object|null}
*/
function findOne(data, id){
	let one = null;
  if(!data || !id){
    return one;
  }

	for (var i = 0; i < data.length; i++) {
		if(data[i]._id === id){
			one = data[i];
			break;
		}
	}
	return one;
}
/**
* @name delOne
* @description return JSONArray without one item
* @param data - {JSONArray} list to parse
* @param id - {String} object's _id to delete
* @return {JSONArray|null}
*/
function delOne(data, id){
  let toReturn = null;
  if(!data || !id){
    return toReturn;
  }

  toReturn = data.filter(item => item._id !== id);
  return toReturn;
}

/**
* @name populateDataFromOtherResource
* @description parse JSONArray to find properties which reference another resource and populate it
* @param data - {JSONArray} list to parse
* @param projectPath - {String} project path
* @return {JSONArray}
*/
function populateDataFromOtherResource(data, projectPath){
	let resources = {};
	let toReturn = [];

  // parse data
	for (let i = 0; i < data.length; i++) {
		let item = extend({}, data[i]);

    // parse properties to find '$ref_'
		for(let key in item){
			let value = item[key];
			if(!value.startsWith("$ref")){
				continue;
			}
      // split to find resource file name and _id
			let resource = value.split("_");
			if(!resources[resource[1]]){
				let resourcePath = path.join(projectPath, resource[1]);
				resources[resource[1]] = getFileResourceSync(resourcePath);
			}
      // get the object from resource file and update current item
			item[key] = findOne(resources[resource[1]], resource[2]);
		}

		toReturn.push(item);
	}
	return toReturn;
}


module.exports = {
  getFileResourceSync: getFileResourceSync,
  getFileResource: getFileResource,
  writeFileResource: writeFileResource,
  findOne: findOne,
  delOne: delOne,
  populateDataFromOtherResource: populateDataFromOtherResource
};
