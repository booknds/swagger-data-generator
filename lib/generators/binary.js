const _ = require('lodash');

/**
 * binary - creates a random binary string of 4 octets
 *
 * @returns {string} - the concatenated binary string;
 */
function binary() {
  const randomOctets = [
    _.random(0, 255),
    _.random(0, 255),
    _.random(0, 255),
    _.random(0, 255),
  ];

  const binaryString = randomOctets.reduce(
    (currentBinaryString, randomNumber) => {
      const binaryRepresentationOfRandomNumber = randomNumber.toString(2);

      return `${currentBinaryString} ${binaryRepresentationOfRandomNumber}`;
    }, '');

  return binaryString;
}

module.exports = binary;

