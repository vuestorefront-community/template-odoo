const dotenv = require('dotenv');
const fs = require('fs');

function addTrailingSlashToUrls(envVariablesToCheck) {  
  const dotEnvIndex = process.argv.findIndex(item => item.includes('--dotenv'));
  const dotEnvPath = process.argv[dotEnvIndex + 1]

  const envConfig = dotenv.parse(fs.readFileSync(dotEnvPath || '.env'));

  function addSlashIfNeeded(envVarUrl) {
    if (envVarUrl !== undefined && !envVarUrl.endsWith('/')) {
      return envVarUrl + '/';
    }
    return envVarUrl;
  }

  for (const envVar of envVariablesToCheck) {
    envConfig[envVar] = addSlashIfNeeded(envConfig[envVar]);
  }

  for (const key in envConfig) {
    process.env[key] = envConfig[key];
  }
 
}
const envVariablesToCheck = ['BASE_URL', 'SITE_URL'];
//addTrailingSlashToUrls(envVariablesToCheck);
module.exports = async () => addTrailingSlashToUrls;