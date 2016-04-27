
/**
 * Generates a random Base64 encoded character string
 *
 * @method     byte
 * @param      {Object}  gen - The genator object passed from json-schema-faker
 * @return     {string}      - A base64 encoded string of characters
 */
function byte(gen) {
  var randomWord = gen.faker.random.words();
  var buff = new Buffer(randomWord);
  var base64Encoded = buff.toString('base64');

  return base64Encoded;
}

module.exports = byte;

