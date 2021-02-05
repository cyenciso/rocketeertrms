import axios from 'axios';
import { Employee } from '../models/employee.model';

class EmployeeService {

    private URI: string;

    constructor() {
        this.URI = 'http://localhost:9000/users';
    }

    // gets logged in user from backend session
    getLogin(): Promise<Employee> {
        return axios.get(this.URI, {withCredentials: true}).then(result => {
            console.log('result from back-end', result);
            return result.data
        });
    }

    // returns either an employee object or null if not found
    login(employee: Employee): Promise<Employee> {
        return axios.post(this.URI, employee, {withCredentials: true}).then(result => result.data);
    }

    logout(): Promise<null> {
        return axios.delete(this.URI, {withCredentials: true}).then(result => null);
    }

    getSeniorEmployeeByRole(role: string[]): Promise<Employee[]> {
        return axios.get(this.URI+'/'+role).then(result => result.data);
    }

    getEmployeeByRole(role: string[]): Promise<Employee[]> {
        return axios.get(this.URI+'/employees/'+role).then(result => result.data);
    }

    updateEmployee(employee: Employee): Promise<Employee> {
        return axios.put(this.URI+"/update", employee).then( result => result.data);
    }

    getEmployeeByUsername(username: string): Promise<Employee> {
        return axios.get(this.URI+'/user/'+username).then(result => result.data);
    }

    getEmployees(): Promise<Employee> {
        return axios.get(this.URI+'/all').then(result => result.data);
    }
}

export default new EmployeeService();