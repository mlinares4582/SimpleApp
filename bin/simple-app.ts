#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { SimpleAppStack } from '../lib/simple-app-stack';
import { SimpleAppStackDns } from '../lib/simple-app-stack-dns';

const domainNameApex = 'mglinares.click';
const app = new cdk.App();

const { hostedZone, certificate } = new SimpleAppStackDns(app, 'SimpleAppStackDns',{
  env: { region: 'us-east-1'},
  dnsName:domainNameApex,
});


new SimpleAppStack(app, 'SimpleAppStack',{
  env: { region: 'us-east-1'},
  dnsName: domainNameApex,
  hostedZone,
  certificate,
});  
