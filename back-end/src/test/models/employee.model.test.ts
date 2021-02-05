import { Employee } from '../../../src/models/employee.model';

describe('Employee class', () => {
    test('constructor', () => {
        const employee = new Employee('Bob1', '1234', 'Bob', 'Smith', '111-111-1111', 'bob.smith@revature.net', ['Employee']);
    
        expect(employee.username).toBe('Bob1');
        expect(employee.password).toBe('1234');
        expect(employee.demographics.firstname).toBe('Bob');
        expect(employee.demographics.lastname).toBe('Smith');
        expect(employee.demographics.phone).toBe('111-111-1111');
        expect(employee.demographics.email).toBe('bob.smith@revature.net');
        expect(employee.role).toEqual(['Employee']);
    });
});

