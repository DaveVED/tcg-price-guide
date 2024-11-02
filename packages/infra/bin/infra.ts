#!/usr/bin/env node
import "source-map-support/register";
import * as zor from "@dsqr/zor";
import * as dyanmodb from "aws-cdk-lib/aws-dynamodb";

import { ImageCdnStack } from "../lib/stacks/image-cdn";
import { FoundationStack } from "../lib/stacks/foundation";
import { StaticSiteStack } from "../lib/stacks/static-site";
import { ReferenceTableStack } from "../lib/stacks/reference-table";
import { ReferenceApiStack } from "../lib/stacks/reference-api";

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};
const stage = process.env.CDK_STAGE || "development";

const app = new zor.aws.App({
  name: "TCGPriceGuide",
  stage: stage,
  region: env.region,
  account: env.account,
});

// Foundation stack (non-environment specific)
const foundationStack = new FoundationStack(app, "FoundationStack", {
  env,
  stage: process.env.CDK_STAGE || "development",
  rootDomain: "tcg-price-guide.com",
});

app.addEnvironmentStage(`TCGPriceGuide`, (stage) => {
  // Image CDN.
  const imageCdn = new ImageCdnStack(stage, "ImageCDN", {
    stage: app.stage,
    zor: foundationStack.foundationResources,
  });

  // Static Website
  const site = new StaticSiteStack(stage, "StaticSite", {
    stage: app.stage,
    zor: foundationStack.foundationResources,
  });

  // Reference Data Table
  const referenceTable = new ReferenceTableStack(stage, "ReferenceTable", {
    stage: app.stage,
  });
  const referenceApi = new ReferenceApiStack(stage, "ReferenceApi", {
    stage: app.stage,
    zor: foundationStack.foundationResources,
  });
  referenceTable.table.grantReadData(referenceApi.function);
});
