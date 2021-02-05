import employeeService from '../../services/employee.service';
import { Employee } from '../../models/employee.model';

describe('addEmployee', () => {
    test('should add a new employee to the database', async () => {
        const params = new Employee('Bob1', '1234', 'Bob', 'Smith', '111-111-1111', 'bob.smith@revature.net', ['Employee']);

        const spy = jest.spyOn(employeeService, 'addEmployee').mockImplementation(() => params);

        const success = await employeeService.addEmployee(params);
        //done();

        expect(success).toBeTruthy;
        expect(spy).toHaveBeenCalledTimes(1);
    });
});

describe('getEmployeeByUsername', () => {
    test('', () => {

    });
});