import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Bucket, BucketEncryption } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import * as path from 'path';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { CloudFrontWebDistribution, Distribution } from 'aws-cdk-lib/aws-cloudfront'; 
import { ARecord, IPublicHostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { ICertificate } from 'aws-cdk-lib/aws-certificatemanager';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';

interface SimpleAppStackProps extends StackProps {
  dnsName: string;
  hostedZone: IPublicHostedZone
  certificate: ICertificate;
}

export class SimpleAppStack extends Stack {
  constructor(scope: Construct, id: string, props: SimpleAppStackProps) {
    super(scope, id, props);
    // const{ dnsName, hostedZone, certificate } =props;
    // The code that defines your stack goes here
    const bucket = new Bucket(this, 'MySimpleAppBucket', {
      encryption: BucketEncryption.S3_MANAGED 
      });
  
      new BucketDeployment(this,'MySimpleAppPhotos', {
        sources: [
          Source.asset(path.join(__dirname,'..', 'photos'))
        ],
        destinationBucket: bucket,
      });

    // New bucket for the React App
    const websiteBucket = new Bucket(this, 'MySimpleAppWebsiteBucket',{
      // tell what index document we are going to use when people reach the url.
      websiteIndexDocument: 'index.html',
      publicReadAccess: true,
    })

    const cloudFront = new Distribution(this,'MySimpleAppDistribution', {
      defaultBehavior: {origin: new S3Origin(websiteBucket)},
      domainNames: [props.dnsName],
      certificate:props.certificate
    });


      new ARecord( this, 'MySimpleAppARecordApex', {
        zone: props.hostedZone,
        target: RecordTarget.fromAlias(new CloudFrontTarget(cloudFront)),
      });


    new BucketDeployment(this,'MySimpleWebsiteDeploy',{
      sources: [Source.asset(path.join(__dirname, '..','frontend','build'))],
      destinationBucket: websiteBucket,
      distribution: cloudFront
    })


    const getPhotos = new NodejsFunction(this, 'MySimpleAppLambda', {
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


    const apigw = new LambdaRestApi(this, 'simpleAppApi', {
      restApiName: 'Simple App Api ',
      handler: getPhotos,
      proxy: false,
      

        defaultCorsPreflightOptions: {
          allowHeaders: [
            'Content-Type',
            'X-Amz-Date',
            'Authorization',
            'X-Api-Key',
          ],
        allowMethods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowCredentials: true,
        allowOrigins: ['*'],
    
      },
    });

    const photoApi = apigw.root.addResource('getAllPhotos');
      photoApi.addMethod('GET');


    new CfnOutput(this, 'MySimpleAppBucketNameExport', {
      value: bucket.bucketName,
      exportName: `MySimpleAppBucketName`,
    });

    new CfnOutput(this,'MySimpleAppWebsiteBucketNameExport',{
      value: websiteBucket.bucketName,
      exportName: `MySimpleAppWebsiteBucketName`,
    });

    new CfnOutput(this,'MySimpleAppWebsiteUrl',{
      value: cloudFront.distributionDomainName,
      exportName: `MySimpleAppUrl`,

    });
  }
}

