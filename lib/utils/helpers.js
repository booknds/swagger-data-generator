var toPairs = require('lodash').toPairs;

/**
 * requireAllProperties - Creates a new definitions object. Each definintion is updated
 *                      to require all of its properties. This makes sure that JSON-Schema-Faker
 *                      populates data for each property of a definition
 *
 * @param definitions {Object}  - the definitions object of a swagger doc
 * @returns           {Object}  - a new definitions object
 */
function requireAllProperties(definitions) {
  var definitionPairs = toPairs(definitions);
  var apiProperties = definitionPairs
    .map(function getPropertyNames(definitionPair) {
      return Object.keys(definitionPair[1].properties);
    });


  var newDefinitionsCollection = definitionPairs
    // adds or overwrites the required property of each definition object
    .map(function makeAllPropertiesRequired(definitionPair, index) {
      var definitionKey = definitionPair[0];
      var definitionValue = Object.assign({}, definitionPair[1]);

      definitionValue.required = apiProperties[index];

      return [definitionKey, definitionValue];
    })
    .reduce(function createNewDefinitionObject(definitionsObject, definitionPair) {
      var key = definitionPair[0];
      var value = definitionPair[1];
      var passedDefinitions = definitionsObject;
      passedDefinitions[key] = value;

      return passedDefinitions;
    }, {});

  return newDefinitionsCollection;
}

module.exports = {

  requireAllProperties,

};

