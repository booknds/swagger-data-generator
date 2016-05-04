var _ = require('lodash');

/**
 * binary - creates a random binary string of 4 octets
 *
 * @returns {string} - the concatenated binary string;
 */
function binary() {
  var randomOctets = [
    _.random(0, 255),
    _.random(0, 255),
    _.random(0, 255),
    _.random(0, 255),
  ];

  var binaryString = randomOctets.reduce(
    function createOctet(currentBinaryString, randomNumber, index) {
      var binaryRepresentationOfRandomNumber = randomNumber.toString(2);

      if (index === 0) {
        return binaryRepresentationOfRandomNumber;
      }

      return currentBinaryString + ' ' + binaryRepresentationOfRandomNumber;
    }, '');

  return binaryString;
}

module.exports = binary;

