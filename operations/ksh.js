const shell = require('shelljs');
 
module.exports = (context, pod) => {
  const pods = shell.exec(`kubectl get pods | grep "${pod}"`, { silent: true }).stdout;
  const lines = pods.split("\n");
  const line = lines[0];
  const podMatch = line.match(/([a-z0-9\-]+)\s/i);
  if (podMatch) {
    const pod = podMatch[1];
    const cmd = `kubectl exec -ti ${pod} -- sh`;
    shell.echo('For now, you need to paste the following into your terminal:');
    shell.echo(cmd);
  } else {
    console.error(`Could not find any pod matching "${pod}"`);
  }
};