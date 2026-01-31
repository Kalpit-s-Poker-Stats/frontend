const { writeFileSync } = require('fs');
const { argv } = require('yargs');

require('dotenv').config({
  path: `.env`
});

const targetPath = './src/environments/environment.ts';

const envConfigFile = `
export const environment = {
  production: true,
  secretKey: '${process.env.SECRET_KEY}',
  apiUrl: '${process.env.API_URL}',
  discord: {
    clientId: '${process.env.DISCORD_CLIENT_ID}',
    redirectUri: '${process.env.DISCORD_REDIRECT_URI}'
  }
};
`;

writeFileSync(targetPath, envConfigFile, { encoding: 'utf-8' });
console.log(`Output generated at ${targetPath}`);
