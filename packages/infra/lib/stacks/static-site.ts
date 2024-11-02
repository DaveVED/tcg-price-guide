import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as zor from "@dsqr/zor";
import * as s3 from "aws-cdk-lib/aws-s3";
import { FoundationResources } from "./foundation";

export interface StaticSiteStackProps extends cdk.StackProps {
  stage: string;
  zor: FoundationResources;
}

export class StaticSiteStack extends cdk.Stack {
  public readonly imageBucket: s3.IBucket;

  constructor(scope: Construct, id: string, props: StaticSiteStackProps) {
    super(scope, id, props);

    const domainName =
      props.stage === "development"
        ? `dev.${props.zor.domainName}`
        : `${props.zor.domainName}`;

    new zor.aws.StaticSite(this, "TCGPriceGuide", {
      indexPage: "index.html",
      customDomain: {
        domainName: domainName,
        override: {
          hostedZone: props.zor.hostedZone,
          certificate: props.zor.certificate,
        },
      },
    });
  }
}
