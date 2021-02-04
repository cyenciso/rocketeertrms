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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTable = exports.deleteTable = void 0;
var AWS = __importStar(require("aws-sdk"));
var log_1 = __importDefault(require("../log"));
// set the region
AWS.config.update({ region: 'us-west-2' });
// create a DynamoDB service object
var database = new AWS.DynamoDB({ apiVersion: '2012-08-10' });
// create the table schema
var employeeSchema = {
    AttributeDefinitions: [
        {
            AttributeName: 'username',
            AttributeType: 'S'
        }
    ],
    KeySchema: [
        {
            AttributeName: 'username',
            KeyType: 'HASH'
        }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    },
    TableName: 'employees',
    StreamSpecification: {
        StreamEnabled: false
    }
};
/*
    This function deletes the table
*/
function deleteTable() {
    database.deleteTable({ TableName: 'employees' }, function (err, data) {
        if (err) {
            log_1.default.error('Unable to delete table. Error JSON:', JSON.stringify(err, null, 2));
        }
        else {
            log_1.default.info('Deleted table. Table description JSON:', JSON.stringify(data, null, 2));
        }
    });
}
exports.deleteTable = deleteTable;
/*
    This function creates the table
*/
function createTable() {
    database.createTable(employeeSchema, function (err, data) {
        if (err) {
            log_1.default.error('Unable to create table: ', err);
        }
        else {
            log_1.default.info('Table created', data);
        }
    });
}
exports.createTable = createTable;
/* setup ------------------------------------------------------------------------------------------ */
//createTable();
