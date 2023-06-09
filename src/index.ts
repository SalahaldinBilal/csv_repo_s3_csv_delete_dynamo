import * as dotenv from 'dotenv'
dotenv.config();
import type { S3Handler } from 'aws-lambda';
import { Logger } from './logger';
import {
  deleteDynamoTable,
  waitForTableDeletion
} from './helpers';

export const handler: S3Handler = async (event) => {
  try {
    const fileObject = event.Records[0].s3.object;
    const fileName = decodeURIComponent(fileObject.key.replace(/\+/g, " "));;
    const tableName = `salah_csv_repo_${fileName.replace(/[^a-zA-Z0-9_.-]/gm, "_")}`;
    const logger = new Logger(fileName);

    logger.log("Deleting table");
    const response = await deleteDynamoTable(tableName);
    console.log("Deletion response: ", JSON.stringify(response, null, 2))

    logger.log("Waiting for table to be fully deleted");
    await waitForTableDeletion(tableName);
  } catch (error) {
    console.error(error);
    Logger.getLastLog();
  }
};