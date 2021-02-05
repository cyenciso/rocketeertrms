import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import dynamo from '../database/dynamo';
import logger from '../log';
import { Employee } from '../models/employee.model';

class EmployeeService {

    private doc: DocumentClient;

    constructor(){
        this.doc = dynamo;
    }

    /*
        This function adds an employee to the database
    */
    async addEmployee(employee: Employee): Promise<boolean> {

        const params = {
            TableName: 'employees',
            Item: employee,
            ConditionExpression: '#username <> :username',
            ExpressionAttributeNames: {
                '#username': 'username'
            },
            ExpressionAttributeValues: {
                ':username': employee.username
            }
        };

        return await this.doc.put(params).promise().then(() => {
            logger.info('Successfully added employee');
            return true;
        }).catch((error) => {
            logger.error('Error: could not add employee to the database');
            logger.error(error);
            return false;
        });
    }

    /*
        This function gets an employee from the database by username
    */
   async getEmployeeByDemographics(stringified: any): Promise<Employee[]> {
        let demographics = JSON.parse(stringified);
        const params = {
            TableName: 'employees',
            FilterExpression: "#demographics = :demographics",
            ExpressionAttributeNames: {
                '#demographics': 'demographics'
            },
            ExpressionAttributeValues: {
                ":demographics": demographics
            }
        };
        return await this.doc.scan(params).promise().then((data) => {
            if (data && data.Items) {
                logger.debug(`data.Item from demographics function: ${JSON.stringify(data.Items)}`);
                return data.Items as Employee[];
            } else {
                logger.debug('Object not found in database, returning null!')
                return [];
            }
        });
    }

    async getEmployeeByUsername(username: string): Promise<Employee | null> {
        const params = {
            TableName: 'employees',
            Key: {
                'username': username
            }
        };
        return await this.doc.get(params).promise().then((data) => {
            if (data && data.Item) {
                logger.debug(`data.Item: ${JSON.stringify(data.Item)}`);
                return data.Item as Employee;
            } else {
                logger.debug('Object not found in database, returning null!')
                return null;
            }
        });
    }

    async getEmployees(): Promise<Employee[]> {
        const params = {
            TableName: 'employees'
        };
        return await this.doc.scan(params).promise().then((data) => {
            return data.Items as Employee[];
        }).catch((err) => {
            logger.error(err);
            return [];
        });
    }

    async getSeniorEmployeeByRole(roleArray: string[]): Promise<Employee[]> {
        let seniorRole = [];

        if (JSON.stringify(roleArray) === '"Employee"') {
            seniorRole.push("Employee", "Supervisor");
        } else if (JSON.stringify(roleArray) === '"Employee,Supervisor"') {
            seniorRole.push("Employee", "Supervisor", "Head");
        } else {
            seniorRole.push("Employee", "BenCo", "Supervisor");
        }

        const params = {
            TableName: 'employees',
            FilterExpression: "#role = :role",
            ExpressionAttributeNames: {
                '#role': 'role'
            },
            ExpressionAttributeValues: {
                ":role": seniorRole
            }
        };

        return await this.doc.scan(params).promise().then((data) => {
            logger.debug(`data.Item from senior role function: ${JSON.stringify(data.Items)}`);
            return data.Items as Employee[];
        }).catch((err) => {
            logger.error(err);
            return [];
        });
    
    }

    async getEmployeeByRole(roles: string[]): Promise<Employee[]> {
        console.log(JSON.stringify(roles));
        let roleStringWithExtra = JSON.stringify(roles);
        let roleString = roleStringWithExtra.substring(1, roleStringWithExtra.length - 1);
        console.log(roleString);
        let rolesArray = roleString.split(',');

        const params = {
            TableName: 'employees',
            FilterExpression: "#role = :role",
            ExpressionAttributeNames: {
                '#role': 'role'
            },
            ExpressionAttributeValues: {
                ":role": rolesArray
            }
        };

        return await this.doc.scan(params).promise().then((data) => {
            logger.debug(`data.Item from role function: ${JSON.stringify(data.Items)}`);
            return data.Items as Employee[];
        }).catch((err) => {
            logger.error(err);
            return [];
        });
    }
    // updates an employee 
    async updateEmployee(employee: Employee): Promise<Employee | null> {
        const params = {
            TableName: 'employees',
            Key: {
                'username': employee.username
            },
            UpdateExpression: 'set #requests=:requests, #availableCredit=:availableCredit',
            ExpressionAttributeValues: {
                ':requests': employee.requests,
                ':availableCredit': employee.availableCredit
            },
            ExpressionAttributeNames: {
                '#requests': 'requests',
                '#availableCredit': 'availableCredit'
            },
            ReturnValue: 'UPDATED_NEW'
        };

        return await this.doc.update(params).promise().then(() => {
            logger.info('Successfully updated employee');
            return employee;
        }).catch((error) => {
            logger.error(error);
            return null;
        })
    }
}

const employeeService = new EmployeeService();
export default employeeService;

/* setup ------------------------------------------------------------------------------------------ */

// function populateEmployeeTable() {
//     // employee
//     employeeService.addEmployee(new Employee('Bob1', '1234', 'Bob', 'Smith', '111-111-1111', 'bob.smith@revature.net', ['Employee'])).then(() => {});
//     // supervisor
//     employeeService.addEmployee(new Employee('Brenda1', '1234', 'Brenda', 'Jackson', '222-222-2222', 'brenda.jackson@revature.net', ['Employee', 'Supervisor'])).then(() => {});
//     // department head
//     employeeService.addEmployee(new Employee('Charles1', '1234', 'Charles', 'Fergeson', '333-333-3333', 'charles.fergeson@revature.net', ['Employee', 'Supervisor', 'Head'])).then(() => {});
//     // benco
//     employeeService.addEmployee(new Employee('Wanda1', '1234', 'Wanda', 'Fulton', '444-444-4444', 'wanda.fulton@revature.net', ['Employee', 'BenCo'])).then(() => {});
//     // benco supervisor
//     employeeService.addEmployee(new Employee('Freddie1', '1234', 'Freddie', 'Adams', '111-111-1111', 'freddie.adams@revature.net', ['Employee', 'BenCo', 'Supervisor'])).then(() => {});
//     //employeeService.addEmployee({}).then(() => {});
// }

// populateEmployeeTable();