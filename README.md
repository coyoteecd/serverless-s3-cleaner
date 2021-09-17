# serverless-s3-cleaner

[![serverless][icon-serverless]][link-serverless]
[![license][icon-lic]][link-lic]
[![build status][icon-ci]][link-ci]
[![npm version][icon-npm]][link-npm]

Serverless Framework plugin that empties an S3 bucket before removing a deployed stack.
Replacement for [serverless-s3-remover](https://github.com/sinofseven/serverless-s3-remover) which is no longer maintained.

## Installation

```
npm install serverless-s3-cleaner --save-dev
```

## Usage

Add the following to your `serverless.yml`:

```yml
plugins:
  - serverless-s3-cleaner

custom:
  serverless-s3-cleaner:
    # (optional) Whether to prompt before emptying a bucket. Default is 'false'.
    prompt: false

    # Names of buckets to remove before a stack is removed, or via 'sls s3clean' command
    buckets:
      - bucketName1
      - bucketName2

    # (optional) Buckets to remove before a stack is deployed.
    bucketsToCleanOnDeploy:
      - oldBucketName
```

When removing a Serverless Framework stack, this plugin automatically empties the buckets listed under `buckets` option.

When deploying a Serverless Framework stack, this plugin automatically empties the buckets listed under `bucketsToCleanOnDeploy` option.
Use this when renaming or removing a bucket (put here the old bucket name) to avoid deployment errors when CloudFormation tries to remove the old bucket.

You can also empty a bucket explicitly by running:

```
sls s3remove
```

### Versioning

Buckets with versioning enabled are supported. When emptying a bucket, all object versions and delete markers are deleted.

### IAM Permissions

The plugin requires the following permissions to be given to the role that Serverless runs under, for all the affected buckets:

- s3:ListBucket
- s3:ListBucketVersions
- s3:DeleteObject
- s3:DeleteObjectVersion

[//]: # (Note: icon sources seem to be random. It's just because shields.io is extremely slow so using alternatives whenever possible)
[icon-serverless]: http://public.serverless.com/badges/v3.svg
[icon-lic]: https://img.shields.io/github/license/coyoteecd/serverless-s3-cleaner
[icon-ci]: https://travis-ci.com/coyoteecd/serverless-s3-cleaner.svg?branch=master
[icon-npm]: https://badge.fury.io/js/serverless-s3-cleaner.svg

[link-serverless]: http://www.serverless.com
[link-lic]: https://github.com/coyoteecd/serverless-s3-cleaner/blob/master/LICENSE
[link-ci]: https://travis-ci.com/coyoteecd/serverless-s3-cleaner
[link-npm]: https://www.npmjs.com/package/serverless-s3-cleaner
