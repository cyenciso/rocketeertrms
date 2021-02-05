import * as AWS from 'aws-sdk';
import logger from '../log';

// set the region
AWS.config.update({ region: 'us-west-2' });

// create a DynamoDB service object
const database = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

// create the table schema
const requestSchema = {
    AttributeDefinitions: [
        {
            AttributeName: 'id',
            AttributeType: 'N'
        }
    ],
    KeySchema: [
        {
            AttributeName: 'id',
            KeyType: 'HASH'
        }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    },
    TableName: 'requests',
    StreamSpecification: {
        StreamEnabled: false
    }
};

/*
    This function deletes the table
*/
// export function deleteTable() {
//     database.deleteTable({TableName: 'requests'}, function (err, data) {
//         if (err) {
//             logger.error('Unable to delete table. Error JSON:', JSON.stringify(err, null, 2));
//         } else {
//             logger.info('Deleted table. Table description JSON:', JSON.stringify(data, null, 2));
//         }
//     });
// }

// /*
//     This function creates the table
// */
// export function createTable() {
//     database.createTable(requestSchema, (err, data) => {
//         if (err) {
//             logger.error('Unable to create table: ', err);
//         } else {
//             logger.info('Table created', data);
//         }
//     });
// }


/* setup ------------------------------------------------------------------------------------------ */

createTable();

//deleteTable();