import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as zor from "@dsqr/zor";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

export interface ReferenceTableStackProps extends cdk.StackProps {
    stage: string;
};

export class ReferenceTableStack extends cdk.Stack {
    public readonly table: dynamodb.ITable;

    constructor(scope: Construct, id: string, props: ReferenceTableStackProps) {
        super(scope, id, props);

        this.table = new zor.aws.Table(this, "ReferenceData", {
            primaryIndex: { 
                partitionKey: "SetID",
                sortKey: "SK",
            },
            globalIndexes: {
                "setNameAndSortKeyIndex": {
                    partitionKey: "SetName",
                    sortKey: "SK"
                },
                "sortKeyAndSetIdIndex": {
                    partitionKey: "SK",
                    sortKey: "SetID"
                },
                "sorkKeyAsPrimaryKey": {
                    partitionKey: "SK",
                },
                "gameNameAndSortKeyIndex": {
                    partitionKey: "Game",
                    sortKey: "SK",
                },
                "gameNameAsPrimaryKey": {
                    partitionKey: "Game",
                },
            },
        }).zor.table;
    };
};
