#! /usr/bin/env node

const fs = require('fs');
const readline = require('readline');
const { forEach } = require('lodash');
const SwaggerParser = require('swagger-parser');
const jsf = require('./lib/jsfConfig.js');
const { requireAllProperties } = require('./lib/utils/helpers.js');

const passedUserArguments = process.argv.slice(2);
const swaggerFilePath = passedUserArguments[0];
const outputFilePath = passedUserArguments[1];

if (!swaggerFilePath || !outputFilePath) {
  console.log('command: sdg <path-to-file-input> <path-to-file-output>');
} else {
  SwaggerParser.parse(swaggerFilePath)

    // parse the data and make sure all the properties are required.
    // they need to be required so JSF creates mock data for all properties
    .then(parsedApi => {
      const swaggerDoc = parsedApi;

      swaggerDoc.definitions = requireAllProperties(swaggerDoc.definitions);
      return SwaggerParser.dereference(swaggerDoc);
    })
    .catch(err => console.log(err.message))

    // make sure there are not any references in the definitions and create the mock data
    .then(dereferencedApi => {
      const generatedSwaggerData = {};

      forEach(dereferencedApi.definitions,
        (definition, name) => {
          try {
            generatedSwaggerData[name] = jsf(definition);
          } catch (err) {
            console.log(err);
          }
        });

      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      rl.question(`content in ${outputFilePath} will be overwritten. continue? (y or n): `,
        answer => {
          if (answer === 'y' || answer === 'Y') {
            fs.writeSync(fs.openSync(outputFilePath, 'w'),
                JSON.stringify(generatedSwaggerData, null, '\t'));
          } else {
            rl.write('...Aborting\n');
          }

          rl.close();
          process.stdin.destroy();
        });
    });
}

