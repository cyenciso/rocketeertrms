import logger from "../log";
import employeeService from "../services/employee.service";
import { Request } from "./request.model";

export class Employee {

    public username: string = '';

    public password: string = '';

    public demographics = {
        firstname: '',
        lastname: '',
        phone: '',
        email: ''
    };

    public availableCredit: number = 1000;

    public role: string[] = [];

    public requests: Request[] = [];

    constructor(username: string, password: string, firstname: string, lastname: string, phone: string, email: string, role: string[]){
        this.username = username;
        this.password = password;
        this.demographics.firstname = firstname;
        this.demographics.lastname = lastname;
        this.demographics.phone = phone;
        this.demographics.email = email;
        this.role = role;
    }

}

export async function login(name: string, password: string): Promise<Employee|null> {
    return await employeeService.getEmployeeByUsername(name).then((employee)=> {
        if (employee && employee.password === password) {
            return employee;
        } else {
            logger.debug('User was not found in database, returning null from employee login function!');
            return null;
        }
    })
}