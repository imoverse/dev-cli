const shell = require('shelljs');

module.exports = (context, search) => {
  const pods = shell.exec(`kubectl get pods | grep "${search}"`, { silent: true }).stdout;
  const lines = pods.split('\n');
  const line = lines[0];
  const podMatch = line.match(/([a-z0-9-]+)\s/i);
  if (podMatch) {
    const pod = podMatch[1];
    const containerMatch = pod.match(/(.*)-[a-z0-9]+-[a-z0-9]+/);
    if (containerMatch) {
      const container = containerMatch[1];
      const cmd = `kubectl logs ${pod} ${container} ${context.options.filter(o => o[0] === '-').join(' ')}`;
      shell.echo(cmd);
      shell.exec(cmd);
    } else {
      shell.echo(`Could not find container. Found pod name "${podMatch[1]}". Expected format with at least two dashes.`);
    }
  } else {
    shell.echo(`Could not find any pod matching "${search}"`);
  }
};
