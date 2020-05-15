const yaml = require('yaml');
const chalk = require('chalk');
const getFileContent = require('../helpers/get_file_content');

const getYaml = (file) => {
  const fileContent = getFileContent(file);;
  if (fileContent) {
    return yaml.parse(fileContent);
  }
  return null;
}

const getFilePath = (context, file) => {
  return `${context.root}/${context.currentContainer}/k8s/${file}`;
};

const getVarsFromDeployment = (obj) => {
  const vars = {};
  const addVars = c => {
    if (c.env) {
      c.env.forEach(e => vars[e.name] = e.valueFrom.secretKeyRef ? 'secret' : 'config' );
    }
  };
  try {
    obj.spec.template.spec.containers.forEach(addVars);
    obj.spec.template.spec.initContainers.forEach(addVars);
    return vars;
  } catch (ex) {
    return null;
  }
};

const base64DecodeValues = (data = {}) => {
  const result = {};
  Object.keys(data).forEach((k) => {
    result[k] = Buffer.from(data[k], 'base64').toString();
  });
  return result;
}

module.exports = (context, envArg, variable) => {
  const envs = {
    prod: 'production',
    test: 'test',
    production: 'production',
  };
  const env = envs[envArg];

  const baseFile = getYaml(getFilePath(context, 'base/config.yml')) || { data: {}};
  const envFile = getYaml(getFilePath(context, `overlays/${env}/config.yml`)) || { data: {}};

  const baseSecrets = getYaml(getFilePath(context, 'base/secrets.yml')) || { data: {}};
  
  const envSecrets = getYaml(getFilePath(context, `overlays/${env}/secrets.yml`)) || { data: {}};
  const envVars = Object.assign({}, baseFile.data, base64DecodeValues(baseSecrets.data), envFile.data, base64DecodeValues(envSecrets.data));

  const baseDeployment = getYaml(getFilePath(context, `base/deployment.yml`));
  const envDeployment = getYaml(getFilePath(context, `overlays/${env}/deployment.yml`)) || {};

  const baseDeploymentVars = getVarsFromDeployment(baseDeployment);
  const envDeploymentVars = getVarsFromDeployment(envDeployment);
  const deploymentVars = Object.assign({}, baseDeploymentVars, envDeploymentVars);
  console.log('');
  console.log(chalk.green('Variable is OK'));
  console.log(chalk.magenta('Variable is in deployment but value is missing'));
  console.log(chalk.yellow('Variable is in config but not in deployment'));
  console.log(`
VARIABLE                       VALUE
=============================================================================  `);
  const printVar = k => {
    const colorFn = deploymentVars[k] ? chalk.green : chalk.yellow;
    console.log(`${`${k} ${deploymentVars[k] === 'secret' ? '(secret)' : ''}                             `.substr(0, 30)} ${colorFn(envVars[k] || "")}`);
    deploymentVars[k] = 'printed';
  };
  Object.keys(envVars).forEach(printVar);
  Object.keys(deploymentVars).filter(d => deploymentVars[d] !== 'printed').forEach(v => console.log(chalk.magenta(v)));
  console.log('');
};
