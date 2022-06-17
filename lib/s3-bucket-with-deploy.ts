import * as cdk from'aws-cdk-lib';
import { Construct } from 'constructs';

interface S3BucketWithDeployProps{

}

export class S3BucketWithDeploy extends Construct {
    constructor(
        scope: Construct,
        id: string,
        props?: S3BucketWithDeployProps)
        {
        super(scope,id);
    }
}