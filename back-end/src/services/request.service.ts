import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import dynamo from '../database/dynamo';
import logger from '../log';
import { Request } from '../models/request.model';

class RequestService {

    private doc: DocumentClient;

    constructor(){
        this.doc = dynamo;
    }

    /*
        This function adds a request to the database
    */
   async addRequest(request: Request): Promise<boolean> {

    const params = {
        TableName: 'requests',
        Item: request
    };

    return await this.doc.put(params).promise().then(() => {
        logger.info('Successfully added request');
        return true;
    }).catch((error) => {
        logger.error('Error: could not add request to the database');
        logger.error(error);
        return false;
    });
}

    /*
        This function gets a request from the database by id
    */
   async getRequestByID(id: number): Promise<Request | null> {
    // GetItem api call allows us to get something by the key
    const params = {
        TableName: 'requests',
        Key: {
            'id': id
        }
    };
    return await this.doc.get(params).promise().then((data) => {
        if (data && data.Item) {
            return data.Item as Request;
        } else {
            return null;
        }
    })
}

    /*
        This function get all the requests from the database
    */
    async getRequests(): Promise<Request[]> {
        const params = {
            TableName: 'requests'
        };
        return await this.doc.scan(params).promise().then((data) => {
            return data.Items as Request[];
        }).catch((err) => {
            logger.error(err);
            return [];
        });
    }

/*
        This function get all the requests from the database that are by a specific employee
    */
    async getRequestsByEmail(email: string): Promise<Request[]> {
        const params = {
            TableName: 'requests',
            FilterExpression: ' #email = :email',
            ExpressionAttributeValues: {
                ':email': email
            }
        };
        return await this.doc.scan(params).promise().then((data) => {
            return data.Items as Request[];
        }).catch((err) => {
            logger.error(err);
            return [];
        });
    }


    /*
        This function updates a request
    */
   async updateRequest(request: Request): Promise<boolean> {
    const params = {
        TableName: 'requests',
        Key: {
            'id': request.id
        },
        UpdateExpression: 'set #username=:username, #dateCreated=:dc, #dateAwarded=:da, #demographics=:dem, #event=:e, #justification=:j, #attachments=:a, #requestInfo=:rqi, #resubmitInfo=:rsi, #rejectInfo=:rji, #statusOf=:s',
        ExpressionAttributeValues: {
            ':dc': request.dateCreated,
            ':da': request.dateAwarded,
            ':dem': request.demographics,
            ':e': request.event,
            ':j': request.justification,
            ':a': request.attachments,
            ':rqi': request.requestInfo,
            ':rsi': request.resubmitInfo,
            ':rji': request.rejectInfo,
            ':s': request.statusOf,
            ':username': request.username
        },
        ExpressionAttributeNames: {
            '#dateCreated': 'dateCreated',
            '#dateAwarded': 'dateAwarded',
            '#demographics': 'demographics',
            '#event': 'event',
            '#justification': 'justification',
            '#attachments': 'attachments',
            '#requestInfo': 'requestInfo',
            '#resubmitInfo': 'resubmitInfo',
            '#rejectInfo': 'rejectInfo',
            '#statusOf': 'statusOf',
            '#username': 'username'
        },
        ReturnValue: 'UPDATED_NEW'
    };

    return await this.doc.update(params).promise().then(() => {
        logger.info('Successfully updated request');
        return true;
    }).catch((error) => {
        logger.error(error);
        return false;
    })
    }
    
}

const requestService = new RequestService();
export default requestService;

/* setup ------------------------------------------------------------------------------------------ */

// function populateGradingFormatTable() {
//     reimbursementService.addReimbursement(new Reimbursement('Bob', 'Smith', '111-111-1111', 'bob.smith@revature.net', 'Certification', '300', 'Letter', 'D', 'Remote', '07/09/2021', '07/10/2021', 'This is the description', 'This is my justification')).then(() => {});
// }

// //populateGradingFormatTable();

// async function getExampleGradingFormat() {

//     let reimbursement = await reimbursementService.getReimbursementByDateTime('2021-01-06T02:42:56.267Z');
//     logger.debug(reimbursement);
// }

//getExampleGradingFormat();