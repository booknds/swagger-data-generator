#! /usr/bin/env node

var _             = require('lodash');
    SwaggerParser = require("swagger-parser"),
    jsf           = require('json-schema-faker');

var swaggerDoc,
  parser = new SwaggerParser();

parser.parse('./PetStore.yaml')
  .then(function (api) {
    swaggerDoc = api;
    console.log("parsing", swaggerDoc);
    return SwaggerParser.dereference(swaggerDoc);
  })
  .then(function (api) {
    console.log("Yeah it works!", api);
  });


SwaggerParser.dereference('./PetStore.yaml')
  .then(function (bundle) {
    // console.log('Bundling');
    // console.log(bundle.definitions.pet);

    var definitions = _.map(bundle.definitions, function(definition) { 
      return Object.assign({}, definition);
    });
    definitions[0].require = ['hi', 'dummy'];
    console.log(definitions);
    console.log(bundle.definitions.pet);

    console.log(_.has(bundle.definitions.pet.properties, 'format'));
    // console.log(_.values(bundle.definitions));
    console.log(_.find(_.values(bundle.definitions), 'format', 'date'));
    // var modifiedDefinition = [];
    // make sure all properties are required
    definitions.map(function (definition, index) {
      var defProps = bundle.definitions[definition].properties;
      var defPropNames = Object.keys(defProps);
      var propsWithDateFormat = defPropNames.filter(function(name) {
        return defProps[name].hasOwnProperty('format') && defProps[name].format === 'date';
      });
      console.log("yeee haw", propsWithDateFormat);
    });

    // console.log(jsf(bundle.definitions.pet));
  })
  .then()
  .catch(function (err) {
    console.log(err);
  });

SwaggerParser.dereference('./Perscription.json')
  .then( function(api) { 
    // console.log("JSON");
    // console.log(api);
  });
