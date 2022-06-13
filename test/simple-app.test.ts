import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as SimpleApp from '../lib/simple-app-stack';
// import '@aws-cdk/assert/jest';


// example test. To run these tests, uncomment this file along with the
// example resource in lib/simple-app-stack.ts
test('Simple App Stack', () => {
  const app = new cdk.App();
    // WHEN
  const stack = new SimpleApp.SimpleAppStack(app, 'MyTestStack');
    // THEN
  const template = Template.fromStack(stack);

  template.hasResource('AWS::S3::Bucket', {
    // VisibilityTimeout: 300
  });
});


test('Stack create a S3 bucket', () => {

  const app = new cdk.App();
    // WHEN
  const stack = new SimpleApp.SimpleAppStack(app, 'MyTestStack');
    // THEN
  const template = Template.fromStack(stack);

  template.hasResource('AWS::S3::Bucket', {
    // VisibilityTimeout: 300
  });
});


