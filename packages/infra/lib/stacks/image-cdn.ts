import * as cdk from "aws-cdk-lib";
import * as zor from "@dsqr/zor";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";

import { Construct } from "constructs";
import { FoundationResources } from "./foundation";

export interface ImageCdnStackProps extends cdk.StackProps {
    stage: string;
    zor: FoundationResources;
}

export class ImageCdnStack extends cdk.Stack {
    public readonly imageBucket: s3.IBucket;

    constructor(scope: Construct, id: string, props: ImageCdnStackProps) {
        super(scope, id, props);

        // Create an S3 bucket to store images
        this.imageBucket = new zor.aws.Bucket(this, "TCGImages").zor.bucket;

        const domainName = props.stage === "development" 
            ? `cdn-dev.${props.zor.domainName}`
            : `cdn.${props.zor.domainName}`;

        // Configure CloudFront Origin Access Control (OAC) for secure bucket access
        const originAccessControl = new cloudfront.S3OriginAccessControl(this, "TCGImages-OAC", {
            signing: cloudfront.Signing.SIGV4_NO_OVERRIDE,
        });

        // Create a CloudFront Distribution for image CDN
        new zor.aws.Distribution(this, "TCGImages-Distribution", {
            override: {
                distribution: {
                    defaultBehavior: {
                        origin: origins.S3BucketOrigin.withOriginAccessControl(this.imageBucket, {
                            originAccessControl,
                        }),
                        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                    }
                }
            },
            customDomain: {
                domainName,
                override: {
                    hostedZone: props.zor.hostedZone,
                    certificate: props.zor.certificate,
                },
            }
        });
    }
}
