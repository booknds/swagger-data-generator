#! /usr/bin/env node

var SwaggerParser = require("swagger-parser"),
    YAML = require('yamljs'),
    jsf = require('json-schema-faker');

var yamlData = YAML.load('./PetStore.yaml'),
    defs,
    mockedDefinitions;

// SwaggerParser.validate(yamlData)
//   .then(function(api) {
//     console.log("API name: %s, Version: %s", api.info.title, api.info.version);
//   })
//   .catch(function(err) {
//     console.error(err);
//   });

// SwaggerParser.dereference(yamlData)
//   .then(function (api){
//     console.log('BOOM');
//     console.log(api.definitons.veterinarian);
//     console.log('Homie');
//   })
//   .catch(function (err) {
//     console.log(err);
//   });

console.log("activity", yamlData);

var parser = new SwaggerParser();
parser.validate(yamlData)
  .then(function (api) {
     console.log("hi",api);
  })
  .catch(function(err) {
    console.log('guhghg', err);
  });


YAML.load('PetStore.yaml', function(result)
{
  // console.log(result.definitions.veterinarian);
  // console.log(jsf(result.definitions.veterinarian, result));
});

SwaggerParser.parse(yamlData)
  .then(function (api) {
    defs = api.definitions;
    console.log(defs.address);

    var sample = jsf(defs.pet);
    console.log(sample);
});


var schema = {
    //  "type": "object",
    //  "description": "activity info",
     properties: {
         "state": {
             "type": "string",
             "description": "current activity state",
             "enum": ["wait", "process", "over"]
         },
         "deadline": {
             "type": "number",
             "description": "deadline of the activity"
         },
         "remainDays": {
             "type": "integer",
             "description": "days left."
         }
     },
     "required": ["state", "deadline", "remainDays", "needDays", "seasonNum"]
}

console.log(jsf(schema));

// console.log( DataMocker( schema ) );
