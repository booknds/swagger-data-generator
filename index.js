#! /usr/bin/env node

const _ = require('lodash');
const SwaggerParser = require('swagger-parser');
const jsf = require('./lib/jsfConfig.js');

/**
 * allPropsRequired - Creates a new definitions object. Each definintion is updated
 *                      to require all of its properties. This makes sure that JSON-Schema-Faker
 *                      populates data for each property of a definition
 *
 * @param definitions {Object}  - the definitions object of a swagger doc
 * @returns           {Object}  - a new definitions object
 */
function allPropsRequired(definitions) {
  const definitionPairs = _.toPairs(definitions);
  const apiProperties = definitionPairs
    .map(definitionPair => Object.keys(definitionPair[1].properties));


  const newDefinitionsCollection = definitionPairs
    // adds or overwrites the required property of each definition object
    .map((definitionPair, index) => {
      const definitionKey = definitionPair[0];
      const definitionValue = Object.assign({}, definitionPair[1]);

      definitionValue.required = apiProperties[index];

      return [definitionKey, definitionValue];
    })
    .reduce((definitionsObject, definitionPair) => {
      const key = definitionPair[0];
      const value = definitionPair[1];
      const passedDefinitions = definitionsObject;
      passedDefinitions[key] = value;

      return passedDefinitions;
    }, {});

  return newDefinitionsCollection;
}

SwaggerParser.parse('./samples/PetStore.yaml')
  .then(api => {
    const swaggerDoc = api;

    swaggerDoc.definitions = allPropsRequired(swaggerDoc.definitions);
    return SwaggerParser.dereference(swaggerDoc);
  })
  .then(api => {
    _.forEach(api.definitions, definition => {
      let temp;
      try {
        temp = jsf(definition);
        console.log('jsf', temp);
      } catch (err) {
        console.log(err);
      }
    });
  });
