'use strict';

var _ = require('lodash');

/**
 * Generates a Date as a string in JSON Schema full-date format. 
 *
 * @method     fullDate
 * @return     {string}  - a random date as a string.
 */
function fullDate() {
  var YEAR  = _.random(1900, 2030), 
      MONTH = _.random(1, 12),
      DAY   = _.random(1, 28);

  var yearString  = YEAR.toString(),
      monthString = MONTH < 10 ? "0" + MONTH.toString() : MONTH.toString(),
      dayString   = DAY < 10 ? "0" + DAY.toString() : DAY.toString(),
      fullDate    = yearString + '-' + monthString + '-' + dayString;

  return fullDate;
}

module.exports = fullDate;
