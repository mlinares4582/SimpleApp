#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { SimpleAppStack } from '../lib/simple-app-stack';


const app = new cdk.App();
new SimpleAppStack(app, 'SimpleAppStack-dev', {
  env: { region: 'us-east-1'},
  envName: 'dev',
});
new SimpleAppStack(app, 'SimpleAppStack-prod',{
  env: { region: 'us-west-1'},
  envName: 'prod'
});