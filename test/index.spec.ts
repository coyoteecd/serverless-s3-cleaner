import Serverless from 'serverless';
import ServerlessS3Cleaner from '../src/index';

describe('ServerlessS3Cleaner', () => {

  it('should create the plugin', () => {
    const serverless = {
      cli: jasmine.createSpyObj(['log'])
    } as Serverless;

    const plugin = new ServerlessS3Cleaner(serverless);
    expect(plugin).toBeTruthy();
    expect(serverless.cli.log).toHaveBeenCalled();
  });
});
