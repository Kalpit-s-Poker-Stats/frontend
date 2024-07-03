const { writeFileSync } = require('fs');
const { argv } = require('yargs');

require('dotenv').config({
  path: argv.env
});

const targetPath = './src/environments/environment.prod.ts';

const envConfigFile = `
export const environment = {
  production: true,
  secretKey: '${process.env.SECRET_KEY}'
};
`;

writeFileSync(targetPath, envConfigFile, { encoding: 'utf-8' });
console.log(`Output generated at ${targetPath}`);
