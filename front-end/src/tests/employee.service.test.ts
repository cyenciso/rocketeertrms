import axios from 'axios';
import EmployeeService from '../services/employee.service';

test('getEmployees returns with data in it', async () => {
    let returnValues;
    let obj = {data: []};

    axios.get = jest.fn().mockResolvedValue(obj);
    await EmployeeService.getEmployees().then( employees => {
        returnValues = employees;
    });

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(returnValues).toBe(obj.data);
    expect(axios.get).toHaveBeenCalledWith('http://localhost:9000/users/all');
});