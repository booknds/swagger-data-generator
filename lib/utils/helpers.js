var toPairs = require('lodash').toPairs;
var forEach = require('lodash').forEach;

/**
 * requireAllProperties - Creates a new definitions object. Each definintion is updated
 *                      to require all of its properties. This makes sure that JSON-Schema-Faker
 *                      populates data for each property of a definition
 *
 * @param definitions {Object}  - the definitions object of a swagger doc
 * @returns           {Object}  - a new definitions object
 */
function requireAllProperties(definitions) {
  var newDef = {};

  // create a copy of the definition object to return
  forEach(definitions, function copyProperties(value, key) {
    newDef[key] = Object.assign({}, value);
  });

  toPairs(newDef)
    .filter(function removeDefinitionsWithoutProperties(definitionPair) {
      return !!definitionPair[1].properties;
    })
    .map(function getPropertyNames(definitionPair) {
      return [definitionPair[0], Object.keys(definitionPair[1].properties)];
    })
    .forEach(function makeAllPropertiesRequired(definitionProps) {
      var key = definitionProps[0];
      var value = definitionProps[1];

      newDef[key].required = value;
    });

  return newDef;
}

module.exports = {

  requireAllProperties,

};

