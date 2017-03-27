#! /usr/bin/env node

'use strict';

// import dependencies
var fs = require('fs');
var readline = require('readline');
var ArgumentParser = require('argparse').ArgumentParser;
var forEach = require('lodash').forEach;
var SwaggerParser = require('swagger-parser');
var jsf = require('./lib/jsfConfig.js');
var requireAllProperties = require('./lib/utils/helpers.js').requireAllProperties;

// grab expected user input
var parser = new ArgumentParser({
  addHelp: true,
  description: 'Swagger Data Generator generates mock data from Swagger files.',
});
var args;
parser.addArgument(['-y'], { help: 'Always overwrite output file (do not ask to overwrite)', action: 'storeTrue', dest: 'force-yes' });
parser.addArgument(['swagger-input'], { help: 'Input Swagger file' });
parser.addArgument(['json-output'], { help: 'Output file for generated mock data' });
args = parser.parseArgs(process.arguments);

SwaggerParser.parse(args['swagger-input'])

  // parse the data and make sure all the properties are required.
  // they need to be required so JSF creates mock data for all properties
  .then(successfulParse)
  .catch(unSuccessfulParse)

  // make sure there are not any references in the definitions and create the mock data
  .then(dereferencedSuccess);

// *******************************************************
// Helper Functions
// *******************************************************

/**
 * successfulParse - Massage data to require all definiton properties then dereference the api
 *
 * @param parsedApi {Object} - a swagger api in the form of an Object
 * @returns {Object} - A Promise Object for handling dereferencing the api
 */
function successfulParse(parsedApi) {
  var swaggerDoc = parsedApi;

  swaggerDoc.definitions = requireAllProperties(swaggerDoc.definitions);

  return SwaggerParser.dereference(swaggerDoc);
}

/**
 * unSuccessfulParse - an error has occured when parsing, update the user
 *
 * @param err {Object} - an error object describing the error
 */
function unSuccessfulParse(err) {
  console.log(err);
}

/**
 * dereferencedSuccess - all $ref were successfully removed from the defintions
 *
 * @param dereferencedApi {Object} - a swagger api in the form of an Object
 */
function dereferencedSuccess(dereferencedApi) {
  var generatedSwaggerData = {};

  forEach(dereferencedApi.definitions, function generateData(definition, name) {
    try {
      generatedSwaggerData[name] = jsf(definition);
    } catch (err) {
      console.log(err);
    }
  });

  saveOutput(generatedSwaggerData);
}

/**
 * saveOutput - Verify output path and save file
 *
 * @param generatedData {Object} - containes the key-value pairs of definition and its created data
 */
function saveOutput(generatedData) {
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  function writeData(yes) {
    if (yes) {
      fs.writeSync(fs.openSync(args['json-output'], 'w'),
        JSON.stringify(generatedData, null, '\t'));
    } else {
      rl.write('...Aborting\n');
    }
    rl.close();
    process.stdin.destroy();
  }

  if (args['force-yes']) {
    writeData(true);
  } else {
    rl.question('content in ' + args['json-output'] + ' will be overwritten. continue? (y or n): ',
      function handleAnswer(answer) {
        writeData(answer === 'y' || answer === 'Y');
      });
  }
}

