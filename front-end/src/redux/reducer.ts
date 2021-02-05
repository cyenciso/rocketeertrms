import * as Actions from './actions';
import { Employee } from '../models/employee.model';
import { Request } from '../models/request.model';

// define items on app's state
export interface EmployeeState {
    employee: Employee;
    seniorEmployee: Employee;
    juniorEmployee: Employee;
}

export interface RequestState {
    requests: Request[];
    request: Request;
}

export interface AppState extends EmployeeState, RequestState {}

// initial state
const initialState: AppState  = {
    employee: new Employee(),
    seniorEmployee: new Employee(),
    juniorEmployee: new Employee(),
    request: new Request(),
    requests: []
}

// create reducer
const reducer = (state: AppState = initialState, action: Actions.AppAction): AppState => {
    //for testing
    console.log(action);

    const newState = {...state};

    switch (action.type) {
        case Actions.RequestActions.GetRequests:
            newState.requests = action.payload as Request[];
            return newState;
        case Actions.RequestActions.ChangeRequest:
            newState.request = action.payload as Request;
            return newState;
        case Actions.EmployeeActions.GetEmployee:
            newState.employee = action.payload as Employee;
            return newState;
        case Actions.SeniorEmployeeActions.GetSeniorEmployee:
            newState.seniorEmployee = action.payload as Employee;
            return newState;
        case Actions.JuniorEmployeeActions.GetJuniorEmployee:
            newState.juniorEmployee = action.payload as Employee;
            return newState;    
        default:
            return state;
    }
}

export default reducer;