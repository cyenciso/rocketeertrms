import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import dynamo from '../database/dynamo';
import logger from '../log';
import { GradingFormat } from '../models/gradingFormat.model';

class GradingFormatService {

    private doc: DocumentClient;

    constructor(){
        this.doc = dynamo;
    }

    /*
        This function adds a grading format to the database
    */
    async addGradingFormat(gradingFormat: GradingFormat): Promise<boolean> {

        const params = {
            TableName: 'gradingFormats',
            Item: gradingFormat
        };

        return await this.doc.put(params).promise().then(() => {
            logger.info('Successfully added a grading format to the database');
            return true;
        }).catch((error) => {
            logger.error('Error: could not add a grading format to the database');
            logger.error(error);
            return false;
        });
    }

    /*
        This function gets a grading format from the database by gradingType
    */
    async getGradingFormatByType(gradingType: string): Promise<GradingFormat | null> {
        // GetItem api call allows us to get something by the key
        const params = {
            TableName: 'gradingFormats',
            Key: {
                'gradingType': gradingType
            }
        };
        return await this.doc.get(params).promise().then((data) => {
            if (data && data.Item) {
                logger.debug(`data.Item: ${JSON.stringify(data.Item)}`);
                return data.Item as GradingFormat;
            } else {
                return null;
            }
        })
    }

}

const gradingFormatService = new GradingFormatService();
export default gradingFormatService;

/* setup ------------------------------------------------------------------------------------------ */

// function populateGradingFormatTable() {
//     // add each type of grading format
//     gradingFormatService.addGradingFormat(new GradingFormat('Letter', false, 'D')).then(() => {});
//     gradingFormatService.addGradingFormat(new GradingFormat('Percentage', false, '60%')).then(() => {});
//     gradingFormatService.addGradingFormat(new GradingFormat('None', true, 'None')).then(() => {});
// }

// //populateGradingFormatTable();

// async function getExampleGradingFormat() {

//     let gradingFormat = await gradingFormatService.getGradingFormatByType('Letter');
//     logger.debug(gradingFormat);
// }

//getExampleGradingFormat();