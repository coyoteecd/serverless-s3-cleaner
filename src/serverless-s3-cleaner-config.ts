interface ServerlessS3CleanerConfig {
  /**
   * Whether to prompt before emptying each bucket. Defaults to false.
   */
  prompt?: boolean;

  /**
   * Names of buckets to be cleaned up on remove (or by running the s3remove command).
   */
  buckets?: string[];

  /**
   * Names of buckets to be cleaned up before a stack deploy.
   * Use this when e.g. renaming a bucket in the stack resources; the old bucket name should be listed here
   * (and can be removed later once the stack has been upgraded).
   */
  bucketsToCleanOnDeploy?: string[];
}
