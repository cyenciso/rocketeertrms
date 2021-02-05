import { Employee } from '../models/employee.model';
import { Request } from '../models/request.model';

// action interface
export interface AppAction {
    type: string;
    payload: any;
}

// employee actions enum
export enum EmployeeActions {
    GetEmployee = 'GET_EMPLOYEE'
}

// employee senior actions enum
export enum SeniorEmployeeActions {
    GetSeniorEmployee = 'GET_SENIOR_EMPLOYEE'
}

// employee junior actions enum
export enum JuniorEmployeeActions {
    GetJuniorEmployee = 'GET_JUNIOR_EMPLOYEE'
}

// employee action interface
export interface EmployeeAction extends AppAction {
    type: EmployeeActions;
    payload: Employee;
}

// senior employee action interface
export interface SeniorEmployeeAction extends AppAction {
    type: SeniorEmployeeActions;
    payload: Employee;
}

// junior employee action interface
export interface JuniorEmployeeAction extends AppAction {
    type: JuniorEmployeeActions;
    payload: Employee;
}

// request actions enum
export enum RequestActions {
    GetRequests = 'GET_REQUEST',
    ChangeRequest = 'CHANGE_REQUEST'
}

// request action interface
export interface RequestAction extends AppAction {
    type: RequestActions;
    payload: Request | Request[];
}

// get employee action
export function getEmployee(employee: Employee): EmployeeAction {
    const action: EmployeeAction = {
        type: EmployeeActions.GetEmployee,
        payload: employee
    }
    return action;
}

// get senior employee action
export function getSeniorEmployee(employee: Employee): SeniorEmployeeAction {
    const action: SeniorEmployeeAction = {
        type: SeniorEmployeeActions.GetSeniorEmployee,
        payload: employee
    }
    return action;
}

// get junior employee action
export function getJuniorEmployee(employee: Employee): JuniorEmployeeAction {
    const action: JuniorEmployeeAction = {
        type: JuniorEmployeeActions.GetJuniorEmployee,
        payload: employee
    }
    return action;
}

// get request action
// export function getRequest(request: Request): RequestAction {
//     const action: RequestAction = {
//         type: RequestActions.GetRequests,
//         payload: request
//     }
//     return action;
// }

// get requests action
export function getRequests(requests: Request[]): RequestAction {
    const action: RequestAction = {
        type: RequestActions.GetRequests,
        payload: requests
    }
    return action;
}

// change request action
export function changeRequest(request: Request): RequestAction {
    const action: RequestAction = {
        type: RequestActions.ChangeRequest,
        payload: request
    }
    return action;
}


