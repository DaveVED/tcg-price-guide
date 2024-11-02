import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as dsqr from "@dsqr/zor";
import { FoundationResources } from "./foundation";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

export interface ReferenceApiStackProps extends cdk.StackProps {
  stage: string;
  zor: FoundationResources;
}

export class ReferenceApiStack extends cdk.Stack {
  public function: lambda.Function;

  constructor(scope: Construct, id: string, props: ReferenceApiStackProps) {
    super(scope, id, props);
    const domainName =
      props.stage === "development"
        ? `api-dev.${props.zor.domainName}`
        : `api.${props.zor.domainName}`;

    this.function = new dsqr.aws.Function(
      this,
      "ReferenceApiServerlessExpress",
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        code: lambda.Code.fromAsset("lambda.zip"),
        handler: "lambda.handler",
        timeout: cdk.Duration.seconds(30),
      },
    );

    new dsqr.aws.Api(this, "TCGReferenceApi", {
      customDomain: {
        domainName: domainName,
        override: {
          hostedZone: props.zor.hostedZone,
          certificate: props.zor.certificate,
        },
      },
      routes: {
        $default: {
          override: {
            function: this.function,
          },
        },
      },
    });
  }
}
