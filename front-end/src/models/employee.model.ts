import { Request } from "./request.model";

export class Employee {
    [x: string]: any;

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
}