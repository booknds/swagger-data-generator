var jsf = require('json-schema-faker');
var generators = require('./generators/generators.js');

jsf.format('date', generators.fullDate);
jsf.format('byte', generators.byte);

module.exports = jsf;
