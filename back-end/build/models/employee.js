"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Employee = void 0;
var Employee = /** @class */ (function () {
    function Employee(username, password, firstname, lastname, phone, email, role) {
        this.username = '';
        this.password = '';
        this.demographics = {
            firstname: '',
            lastname: '',
            phone: '',
            email: ''
        };
        this.availableCredit = 1000;
        this.role = [];
        this.requests = [];
        this.username = username;
        this.password = password;
        this.demographics.firstname = firstname;
        this.demographics.lastname = lastname;
        this.demographics.phone = phone;
        this.demographics.email = email;
        this.role = role;
    }
    return Employee;
}());
exports.Employee = Employee;
