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

// fs.stat(outputFilePath, (err, stat) => {
//   if (err) {
//     return console.log(err);
//   }
//
//   return console.log(stat);
// });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});


if (!swaggerFilePath) {
  console.log('command: sdg <path-to-file-input> <path-to-file-output>');
} else {
  SwaggerParser.parse(swaggerFilePath)
    .then(parsedApi => {
      const swaggerDoc = parsedApi;

      swaggerDoc.definitions = requireAllProperties(swaggerDoc.definitions);
      return SwaggerParser.dereference(swaggerDoc);
    })
    .catch(err => console.log(err.message))
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

      if (outputFilePath) {
        rl.question(`content in ${outputFilePath} will be overwritten. continue? (y or n)?`,
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
      }
    });
}

