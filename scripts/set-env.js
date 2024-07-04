const { writeFileSync } = require('fs');
const { argv } = require('yargs');

require('dotenv').config({
  path: `.env`
});

const targetPath = './src/environments/environment.ts';

console.log("process: ", process.env);

const envConfigFile = `
export const environment = {
  production: true,
  secretKey: '${process.env.SECRET_KEY}',
  apiUrl: '${process.env.API_URL}'
};
`;

writeFileSync(targetPath, envConfigFile, { encoding: 'utf-8' });
console.log(`Output generated at ${targetPath}`);
