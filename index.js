#! /usr/bin/env node

var _             = require('lodash'),
    SwaggerParser = require('swagger-parser'),
    jsf           = require('./lib/jsfConfig.js'),
    swaggerDoc;

function makeAllPropertiesRequired(apiDefinitions) {
  var apiProperties = apiDefinitions.map(function (definitionPair) {
    return Object.keys(definitionPair.properties);
  });

  apiDefinitions.forEach(function (definition, index) {
    definition.required = apiProperties[index];
    return definition;
  });
}

SwaggerParser.parse('./PetStore.yaml')
  .then(function (api) {
    swaggerDoc = api;
    // console.log("parsing", swaggerDoc);
    makeAllPropertiesRequired(_.values(swaggerDoc.definitions));
    return SwaggerParser.dereference(swaggerDoc);
  })
  .then(function (api) {
    // console.log(api.definitions.pet.properties);
    _.forEach(api.definitions, function (definition) {
      // console.log(definition);
      try {
        var temp = jsf(definition);
        console.log("jsf", temp);
      } catch (err) {
        console.log(err);
      }
    });
  });
