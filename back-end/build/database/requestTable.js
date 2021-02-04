"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var AWS = __importStar(require("aws-sdk"));
// set the region
AWS.config.update({ region: 'us-west-2' });
// create a DynamoDB service object
var database = new AWS.DynamoDB({ apiVersion: '2012-08-10' });
// create the table schema
var requestSchema = {
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
//createTable();
//deleteTable();
