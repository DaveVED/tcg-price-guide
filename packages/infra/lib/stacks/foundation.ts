import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as acm from "aws-cdk-lib/aws-certificatemanager";

export interface FoundationStackProps extends cdk.StackProps {
  stage: string;
  rootDomain: string;
}

export interface FoundationResources extends cdk.StackProps {
  hostedZone: route53.IHostedZone;
  certificate: acm.ICertificate;
  domainName: string;
}

export class FoundationStack extends cdk.Stack {
  public readonly foundationResources: FoundationResources;

  constructor(scope: Construct, id: string, props: FoundationStackProps) {
    super(scope, id, props);
    const hostedZone = route53.HostedZone.fromLookup(this, "HostedZone", {
      domainName: props.rootDomain,
    });
    const certificate = acm.Certificate.fromCertificateArn(
      this,
      "Certificate",
      "arn:aws:acm:us-east-1:381492130802:certificate/637e7ed2-306c-431c-8ea0-98eb4b96d53f",
    );
    this.foundationResources = {
      hostedZone: hostedZone,
      certificate: certificate,
      domainName: "tcg-price-guide.com",
    };
  }
}
