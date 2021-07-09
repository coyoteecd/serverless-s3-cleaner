/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type {
  DeleteObjectsRequest,
  HeadBucketRequest,
  ListObjectVersionsOutput, ListObjectVersionsRequest,
  ObjectIdentifierList
} from 'aws-sdk/clients/s3';
import chalk from 'chalk';
import prompt from 'prompt';
import Serverless from 'serverless';
import Plugin from 'serverless/classes/Plugin';
import Aws from 'serverless/plugins/aws/provider/awsProvider';

export default class ServerlessS3Cleaner implements Plugin {
  public commands: Plugin.Commands;
  public hooks: Plugin.Hooks;
  private provider: Aws;

  constructor(private readonly serverless: Serverless) {
    this.serverless = serverless;
    this.provider = this.serverless.getProvider('aws');

    this.commands = {
      s3remove: {
        usage: 'Remove all files in S3 buckets',
        lifecycleEvents: [
          'remove'
        ]
      }
    };

    this.hooks = {
      'before:deploy:deploy': async () => this.remove(true),
      'before:remove:remove': async () => this.remove(false),
      's3remove:remove': async () => this.remove(false),
    };
  }

  private log(message: string): void {
    this.serverless.cli.log(`S3Cleaner: ${chalk.yellow(message)}`);
  }

  private async remove(isDeploying: boolean): Promise<void> {
    const config = this.loadConfig();
    let bucketsToEmpty = isDeploying ? config.bucketsToCleanOnDeploy : config.buckets;

    if (config.prompt) {
      prompt.start();
      const bucketPromptResults = await prompt.get(bucketsToEmpty.map(bucket => ({
        name: bucket,
        description: `Empty bucket ${bucket}. Are you sure? [yes/no]:`,
        pattern: /(yes|no)/,
        default: 'yes',
        message: 'Must respond yes or no',
      })));

      bucketsToEmpty = [];
      for (const bucket of Object.keys(bucketPromptResults)) {
        const confirmed = bucketPromptResults[bucket].toString() === 'yes';
        if (confirmed) {
          bucketsToEmpty.push(bucket);
        } else {
          this.log(`${bucket}: remove skipped`);
        }
      }
    }

    // Filter out inaccessible buckets before doing the work;
    // this is so we don't log unnecessary/ugly errors in case e.g. old buckets left in bucketsToCleanOnDeploy have already been removed
    const existingBuckets: string[] = [];
    for (const bucket of bucketsToEmpty) {
      const exists = await this.bucketExists(bucket);
      if (exists) {
        existingBuckets.push(bucket);
      } else {
        this.log(`${bucket} not found or you do not have permissions, skipping...`);
      }
    }

    // Parallelize the removal to speed things up
    const removePromises = existingBuckets.map(bucket => this
      .listBucketKeys(bucket)
      .then(keys => this.deleteObjects(bucket, keys))
      .then(() => this.log(`bucket ${bucket} successfully emptied`))
      .catch(err => this.log(`bucket ${bucket} cannot be emptied: ${err}`)));

    await Promise.all(removePromises);
  }

  private async bucketExists(bucket: string): Promise<boolean> {
    const params: HeadBucketRequest = { Bucket: bucket };
    return this.provider.request('S3', 'headBucket', params)
      .then(() => true)
      .catch(() => false);
  }

  private async deleteObjects(bucket: string, keys: ObjectIdentifierList): Promise<void> {
    const maxDeleteKeys = 1000;
    const params: DeleteObjectsRequest[] = [];
    for (let i = 0; i < keys.length; i += maxDeleteKeys) {
      params.push({
        Bucket: bucket,
        Delete: {
          Objects: keys.slice(i, i + maxDeleteKeys),
          Quiet: true
        }
      });
    }

    await Promise.all(params.map(param => this.provider.request('S3', 'deleteObjects', param)));
  }

  private async listBucketKeys(bucketName: string): Promise<ObjectIdentifierList> {
    const listParams: ListObjectVersionsRequest = {
      Bucket: bucketName
    };
    let bucketKeys: ObjectIdentifierList = [];

    while (true) {
      const listResult: ListObjectVersionsOutput = await this.provider.request('S3', 'listObjectVersions', listParams);
      if (listResult.Versions) {
        bucketKeys = bucketKeys.concat(listResult.Versions.map(item => ({ Key: item.Key!, VersionId: item.VersionId! })));
      }
      if (listResult.DeleteMarkers) {
        bucketKeys = bucketKeys.concat(listResult.DeleteMarkers.map(item => ({ Key: item.Key!, VersionId: item.VersionId! })));
      }

      if (!listResult.IsTruncated) {
        break;
      }
      listParams.VersionIdMarker = listResult.NextVersionIdMarker;
      listParams.KeyMarker = listResult.NextKeyMarker;
    }

    return bucketKeys;
  }

  private loadConfig(): Required<ServerlessS3CleanerConfig> {
    const providedConfig: Partial<ServerlessS3CleanerConfig> = this.serverless.service.custom['serverless-s3-cleaner'];
    if (!providedConfig.buckets && !providedConfig.bucketsToCleanOnDeploy) {
      throw new Error('You must configure "buckets" or "bucketsToCleanOnDeploy" parameters in custom > serverless-s3-cleaner section');
    }

    return {
      buckets: providedConfig.buckets || [],
      prompt: providedConfig.prompt || false,
      bucketsToCleanOnDeploy: providedConfig.bucketsToCleanOnDeploy || [],
    };
  }
}

module.exports = ServerlessS3Cleaner;
