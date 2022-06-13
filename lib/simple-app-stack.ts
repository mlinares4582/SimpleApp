import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Bucket, BucketEncryption } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { HttpMethod, Runtime } from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { CorsHttpMethod, HttpApi } from '@aws-cdk/aws-apigatewayv2-alpha';
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';




export class SimpleAppStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const bucket = new Bucket(this, 'MySimpleAppBucket', {
    encryption: BucketEncryption.S3_MANAGED,
    });

    new BucketDeployment(this,'MySimpleAppPhotos', {
      sources: [
        Source.asset(path.join(__dirname,'..', 'photos'))
      ],
      destinationBucket: bucket,
    });

    const getPhotos = new NodejsFunction(this, 'MySimpleAppLambda', {
      runtime: Runtime.NODEJS_12_X,
      entry: path.join(__dirname,'..','api', 'get-photos', 'index.ts'),
      handler: 'getPhotos',
      environment: {
        PHOTO_BUCKET_NAME: bucket.bucketName,
      },
    });

    const bucketContainerPermissions = new PolicyStatement();
    bucketContainerPermissions.addResources(bucket.bucketArn);
    bucketContainerPermissions.addActions('s3:ListBucket');


    const bucketPermissions = new PolicyStatement();
    bucketPermissions.addResources(`${bucket.bucketArn}/*`);
    bucketPermissions.addActions('s3:GetObject', 's3:PutObject');

    getPhotos.addToRolePolicy(bucketContainerPermissions);
    getPhotos.addToRolePolicy(bucketPermissions);

    const httpApi = new HttpApi(this, 'MySimpleAppHttpApi', {
      corsPreflight: {
        allowOrigins: ['*'],
        allowMethods:[CorsHttpMethod.GET],
      },
      apiName:'photo-api',
      createDefaultStage: true
    });

    // const lambdaIntegration = new LambdaIntegration({
    //   handler: getPhotos
    // });

    new CfnOutput(this, 'MySimpleAppBucketNameExport', {
      value: bucket.bucketName,
      exportName:'MySimpleAppBucketName',
    });

  }
}
