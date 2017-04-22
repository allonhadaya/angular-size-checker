const { join } = require('path');
const { readFileSync } = require('fs');
const { gzipSync } = require('zlib');

const dependencies = require('./package.json').dependencies;

const angularPackages = Object.keys(dependencies).filter(p => p.indexOf('@angular') === 0);

console.log('\nreading minified sub-packages...\n');

const minified = angularPackages.map(package => {

  const name = package.split('/')[1];
  const path = join('.', 'node_modules', package, 'bundles', `${name}.umd.min.js`);
  const buffer = readFileSync(path);

  console.log(`${package} :: ${dependencies[package]} :: ${buffer.length}`);
  return buffer;
});

const concatenated = Buffer.concat(minified);

console.log('\nconcatenating and compressing...\n');

const gzipped = gzipSync(concatenated);

const size = gzipped.length;

console.log(`compressed :: ${size}`)
