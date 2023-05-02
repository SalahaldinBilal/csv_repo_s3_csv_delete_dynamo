import * as dotenv from 'dotenv'
import {
  DynamoDBClient,
  DeleteTableCommand,
  waitUntilTableNotExists,
} from "@aws-sdk/client-dynamodb";
import { CsvFile } from './types';
import csv from 'csvtojson';
dotenv.config();

const dynamoClient = new DynamoDBClient({
  region: "us-east-2",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
  }
});

export async function deleteDynamoTable(key: string) {
  const command = new DeleteTableCommand({
    TableName: key
  })

  return await dynamoClient.send(command);
}

export async function waitForTableDeletion(tableName: string) {
  return await waitUntilTableNotExists(
    { client: dynamoClient, maxWaitTime: 200, minDelay: 1, maxDelay: 5 },
    { TableName: tableName }
  )
}