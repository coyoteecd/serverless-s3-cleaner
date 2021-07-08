import Serverless from 'serverless';
import Plugin from 'serverless/classes/Plugin';

export default class ServerlessS3Cleaner implements Plugin {
  public hooks: Plugin.Hooks;

  constructor(serverless: Serverless) {
    this.hooks = {
    };

    serverless.cli.log('serverless-s3-cleaner initialized');
  }
}
