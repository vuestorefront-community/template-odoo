const dotenv = require('dotenv');
const fs = require('fs');



function addTrailingSlashToUrls(envVariablesToCheck) {  

  const envConfig = dotenv.parse(fs.readFileSync('.env'));

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
addTrailingSlashToUrls(envVariablesToCheck);
module.exports = async () => addTrailingSlashToUrls;