//  enable runtime transpilation to use ES6/7 in node

const fs = require('fs');
const babelrc = fs.readFileSync('./.babelrc');

try {
  const config = JSON.parse(babelrc);
  require('babel-core/register')(config);
} catch (err) {
  console.error('==>     ERROR: Error parsing your .babelrc.');
  console.error(err);
}
