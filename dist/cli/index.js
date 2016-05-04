#! /usr/bin/env node
'use strict';

var fs = require('fs');
var readline = require('readline');

var _require = require('lodash');

var forEach = _require.forEach;

var SwaggerParser = require('swagger-parser');
var jsf = require('./lib/jsfConfig.js');

var _require2 = require('./lib/utils/helpers.js');

var requireAllProperties = _require2.requireAllProperties;


var passedUserArguments = process.argv.slice(2);
var swaggerFilePath = passedUserArguments[0];
var outputFilePath = passedUserArguments[1];

if (!swaggerFilePath || !outputFilePath) {
  console.log('command: sdg <path-to-file-input> <path-to-file-output>');
} else {
  SwaggerParser.parse(swaggerFilePath)

  // parse the data and make sure all the properties are required.
  // they need to be required so JSF creates mock data for all properties
  .then(function (parsedApi) {
    var swaggerDoc = parsedApi;

    swaggerDoc.definitions = requireAllProperties(swaggerDoc.definitions);
    return SwaggerParser.dereference(swaggerDoc);
  }).catch(function (err) {
    return console.log(err.message);
  })

  // make sure there are not any references in the definitions and create the mock data
  .then(function (dereferencedApi) {
    var generatedSwaggerData = {};

    forEach(dereferencedApi.definitions, function (definition, name) {
      try {
        generatedSwaggerData[name] = jsf(definition);
      } catch (err) {
        console.log(err);
      }
    });

    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('content in ' + outputFilePath + ' will be overwritten. continue? (y or n): ', function (answer) {
      if (answer === 'y' || answer === 'Y') {
        fs.writeSync(fs.openSync(outputFilePath, 'w'), JSON.stringify(generatedSwaggerData, null, '\t'));
      } else {
        rl.write('...Aborting\n');
      }

      rl.close();
      process.stdin.destroy();
    });
  });
}