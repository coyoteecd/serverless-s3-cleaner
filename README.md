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
```

This plugin does not have any configuration options (yet).

[//]: # (Note: icon sources seem to be random. It's just because shields.io is extremely slow so using alternatives whenever possible)
[icon-serverless]: http://public.serverless.com/badges/v3.svg
[icon-lic]: https://img.shields.io/github/license/coyoteecd/serverless-s3-cleaner
[icon-ci]: https://travis-ci.com/coyoteecd/serverless-s3-cleaner.svg?branch=master
[icon-npm]: https://badge.fury.io/js/serverless-s3-cleaner.svg

[link-serverless]: http://www.serverless.com
[link-lic]: https://github.com/coyoteecd/serverless-s3-cleaner/blob/master/LICENSE
[link-ci]: https://travis-ci.com/coyoteecd/serverless-s3-cleaner
[link-npm]: https://www.npmjs.com/package/serverless-s3-cleaner
