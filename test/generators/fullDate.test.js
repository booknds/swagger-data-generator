const test = require('ava');
const { fullDate } = require('../../lib/generators/generators.js');

test('creates a random date in the format "yyyy-mm-dd"', t => {
  const fullDateRegEx = /\d{4}-\d{2}-\d{2}/;

  t.true(fullDateRegEx.test(fullDate()));
});

