import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import '../css/editRequest.css';
import { useDispatch, useSelector } from 'react-redux';
import { EmployeeState, RequestState } from '../redux/reducer';
import { useHistory } from 'react-router-dom';
import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import requestService from '../services/request.service';
import employeeService from '../services/employee.service';
import { changeRequest, getEmployee, getSeniorEmployee } from '../redux/actions';
import { Employee } from '../models/employee.model';

function EditRequest() {
    // use redux hooks
    const employee = useSelector((state: EmployeeState) => state.employee);
    console.log('Current employee: ', employee);
    const newEmployee = {...employee};

    const request = useSelector((state: RequestState) => state.request);
    const newRequest = {...request};
    console.log('Current request in state: ', request.id);
    
    const history = useHistory();
    const dispatch = useDispatch();

    // validity state
    const [validity, setValidity] =  React.useState({
        isRejectValid : true,
        isRequestInfoValid : true,
        isAdditionalInfoValid: true
    });

    // get junior employees from database
    const [juniorEmployees, setEmployees] = useState([new Employee()]);
    useEffect(() => {
        async function getJuniorEmployees() {
            // get all employees BELOW my role, make them options in a selection input
            const employeesReturned = await employeeService.getEmployees().then( employeesReturned => {
                console.log('all employees returned from db: ', employeesReturned);
                //then perform calculations
                return employeesReturned;
            }).catch( () => {
                console.log('Error, could not get employees');
            });

            // get junior employees
            const juniorEmployees: Employee[] = [];

            if (employeesReturned) {
                employeesReturned.forEach( (employeeElement: any) => {
                    if (employeeElement.role.length < employee.role.length) {
                        if (employee.role.includes('Head') && !employeeElement.role.includes('BenCo')) {
                            juniorEmployees.push(employeeElement);
                        } else if (!employeeElement.role.includes('BenCo')) {
                            juniorEmployees.push(employeeElement);
                        }
                        
                    }
                });
            }
            setEmployees(juniorEmployees);
        }
        getJuniorEmployees();
    }, [employee.role]);

    // check if employee and request's maker are the same
    console.log(employee.demographics.email);
    console.log(request.demographics.email);
    let match = employee.demographics.email === request.demographics.email ? true : false;
    console.log(match);

    //refs for input values
    const rejectionRef = useRef() as MutableRefObject<HTMLTextAreaElement>;
    const moreInfoRef = useRef() as MutableRefObject<HTMLTextAreaElement>;
    const resubmitInfoRef = useRef() as MutableRefObject<HTMLTextAreaElement>;
    const employeeChoiceRef = useRef() as MutableRefObject<HTMLSelectElement>;

    // check status of request
    let status = request.statusOf;
    console.log('status of request being viewed: ', status);

    // get role from status
    const wordArray = status.split(' ');
    let roleToPassTo = wordArray[5];
    console.log('role of person to pass request off to: ', roleToPassTo);
    let needsRevision = false;

    // if needs revision
    if (status.includes('Needs Revision')) {
        // from someone other than employee
        const wordArray = status.split(' ');
        let username = wordArray[3];
        if (username === employee.username) {
            needsRevision = true;
        }
    }

    // if revised
    if ((resubmitInfoRef.current && resubmitInfoRef.current.value) || request.resubmitInfo) {
        newRequest.isRevised = true;
    }

    // handle cancel button
    function handleGoBackButtonClick() {
        history.push("/dashboard");
    }

    // handle rejection button
    async function handleRejectionButtonClick() {
        // make sure rejection decision is filled
        if (!rejectionRef.current.value) {
            setValidity(value => {
                const newValue = {...value, isRejectValid : false};
                return newValue;
            });
            console.log('Error, please enter a rejection reason.');
        } else {
            setValidity(value => {
                const newValue = {...value, isRejectValid : true};
                return newValue;
            });
            // iterate over employee's requests and delete the specific request
            for (let i = 0; i < employee.requests.length; i++) {
                if (request.id === employee.requests[i].id) {
                    newEmployee.requests.splice(i, 1);
                }
            }
            //update current employee with new array of requests
            employeeService.updateEmployee(newEmployee).then( employeeReturned => {
                console.log('employee dispatched to employee state: ', employeeReturned);
                dispatch(getEmployee(employeeReturned));
            }).catch( () => {
                console.log('Employee could not be updated!');
            });

            // change request status and request rejection info in request table (update request)
            newRequest.statusOf = 'Rejected';
            newRequest.rejectInfo = rejectionRef.current.value;
            // update request in DB, no need to dispatch
            requestService.updateRequest(newRequest).then().catch( () => {
                console.log('Error, could not update request in database.');
            });
    
            // get requestor by username
            const requestor = await employeeService.getEmployeeByUsername(newRequest.username).then( employeeReturned => {
                console.log('requestor returned: ', employeeReturned);
                return employeeReturned;
            }).catch( () => {
                console.log('Error, could not get requestor from database');
            });

            //update their request
            if (requestor) {
                for (let i = 0; i < requestor.requests.length; i++) {
                    if (request.id === requestor.requests[i].id) {
                        requestor.requests.splice(i, 1);
                        requestor.requests.push(newRequest);
                    }
                }
            }
             

            // update employee whose status is affected
            if (requestor) {
                requestor.availableCredit += newRequest.projection;
                employeeService.updateEmployee(requestor).then( () => {
                    history.push('/dashboard');
                }).catch( () => {
                    console.log('Employee could not be updated!');
                });
            }
        }
        
    }

    // handle accept button
    async function handleAcceptButtonClick() {

        // if BenCo
        if (newEmployee.role.includes('BenCo')) {
            // change request's status to accepted (update requestor employee)
            newRequest.statusOf = 'Accepted';

            // get requestor by username
            const requestor = await employeeService.getEmployeeByUsername(newRequest.username).then( employeeReturned => {
                console.log('requestor returned: ', employeeReturned);
                return employeeReturned;
            }).catch( () => {
                console.log('Error, could not get requestor from database');
            });

            //update their request
            if (requestor) {
                for (let i = 0; i < requestor.requests.length; i++) {
                    if (request.id === requestor.requests[i].id) {
                        requestor.requests.splice(i, 1);
                        requestor.requests.push(newRequest);
                    }
                }
            }

            // update employee whose request status is affected
            if (requestor) {
                employeeService.updateEmployee(requestor).then().catch( () => {
                    console.log('Employee could not be updated!');
                });
            }

            // change request status in request table (update request)
            requestService.updateRequest(newRequest).then().catch( () => {
                console.log('Error, could not update request in database.');
            });
        } else {
            //get senior employee
            let arrayReturned = await employeeService.getSeniorEmployeeByRole(newEmployee.role).then( employees => {
                return employees;
            }).catch(() => {
                console.log('Error, could not get senior employee!');
            });
            let newArray: Employee[] = [];
            if (arrayReturned) {
                for (const prop in arrayReturned) {
                        newArray.push(arrayReturned[prop]);
                    }
            }
            const newSeniorEmployee = newArray[0];

            // add the request to the senior employee
            newSeniorEmployee.requests.push(newRequest);

            //add request to senior employee's requests
            employeeService.updateEmployee(newSeniorEmployee).then( employeeReturned => {
                console.log('employee dispatched to senioremployee state: ', employeeReturned);
                dispatch(getSeniorEmployee(employeeReturned));
            }).catch( () => {
                console.log('Employee could not be updated!');
            });
        }

        // iterate over employee's requests and delete the specific request
        for (let i = 0; i < employee.requests.length; i++) {
            if (request.id === employee.requests[i].id) {
                newEmployee.requests.splice(i, 1);
            }
        }
        //update current employee with new array of requests
        employeeService.updateEmployee(newEmployee).then( employeeReturned => {
            console.log('employee dispatched to employee state: ', employeeReturned);
            dispatch(getEmployee(employeeReturned));
            history.push('/dashboard');
        }).catch( () => {
            console.log('Employee could not be updated!');
        });
    }

    // handle request info button
    async function handleRequestInfoButtonClick() {
        console.log('request more info button clicked');
        // make sure proper selection of employee is made
        const chosenEmployeeUsername = employeeChoiceRef.current.value;

        if (!moreInfoRef.current.value) {
            setValidity(value => {
                const newValue = {...value, isRequestInfoValid : false};
                return newValue;
            });
            console.log('Error, please enter a request for more information.');
        } else {
            setValidity(value => {
                const newValue = {...value, isRequestInfoValid : true};
                return newValue;
            });
            // change request status in database (update request)
            newRequest.statusOf = 'Needs Revision from ' + chosenEmployeeUsername + ' for ' + JSON.stringify(employee.role);
            newRequest.requestInfo = moreInfoRef.current.value;
            newRequest.isRevised = false;
            newRequest.resubmitInfo = "";
            requestService.updateRequest(newRequest).then().catch( () => {
                console.log('Error, could not update request in database.');
            });

            //give request to the selected person if they are NOT the requestor
            if (chosenEmployeeUsername !== request.username) {
                //give request to selected person
                employeeService.getEmployeeByUsername(chosenEmployeeUsername).then( employee => {
                    employee.requests.push(newRequest);
                    employeeService.updateEmployee(employee).then().catch( () => {
                        console.log('Error, could not update selected employee');
                    });
                }).catch( () => {
                    console.log('Error, could not get selected employee from database');
                });
            }

            // change requestor's current request's status (update employee)
            // get from db by username
            const requestor = employeeService.getEmployeeByUsername(request.username).then( employee => {
                return employee;
            }).catch( () => {
                console.log('Error, could not get user from database');
            });

            if (requestor) {
                requestor.then( requestor => {
                    //update their request
                    if (requestor) {
                        for (let i = 0; i < requestor.requests.length; i++) {
                            if (request.id === requestor.requests[i].id) {
                                requestor.requests.splice(i, 1);
                                requestor.requests.push(newRequest);
                            }
                        }
                    }

                    // update employee whose request status is affected
                    if (requestor) {
                        employeeService.updateEmployee(requestor).then().catch( () => {
                            history.push('/dashboard');
                            console.log('Employee could not be updated!');
                        });
                    }
                });
            }

            // iterate over employee's requests and delete the specific request
            for (let i = 0; i < employee.requests.length; i++) {
                if (request.id === employee.requests[i].id) {
                    newEmployee.requests.splice(i, 1);
                }
            }
            //update current employee with new array of requests
            employeeService.updateEmployee(newEmployee).then( employeeReturned => {
                console.log('employee dispatched to employee state: ', employeeReturned);
                dispatch(getEmployee(employeeReturned));
                history.push('/dashboard');
            }).catch( () => {
                console.log('Employee could not be updated!');
            });
        }
    }

    async function handleResubmitButtonClick() {
        //make sure resubmit info is filled
        if(!resubmitInfoRef.current.value) {
            setValidity(value => {
                const newValue = {...value, isAdditionalInfoValid : false};
                return newValue;
            });
            console.log('Error, please enter additional information');
        } else {
            setValidity(value => {
                const newValue = {...value, isAdditionalInfoValid : true};
                return newValue;
            });
            // change request status, update request in db
            newRequest.statusOf = 'Pending';
            newRequest.isRevised = true;
            newRequest.resubmitInfo = resubmitInfoRef.current.value;
            requestService.updateRequest(newRequest).then( () => {
                dispatch(changeRequest(newRequest));
            }
            ).catch( () => {
                console.log('Error, could not update request in database.');
            });

            // change current employee's request status if NOT requestor, update employee in db
            if (employee.username !== request.username) {
                // iterate over employee's requests and delete the specific request
                for (let i = 0; i < employee.requests.length; i++) {
                    if (request.id === employee.requests[i].id) {
                        newEmployee.requests.splice(i, 1);
                    }
                }
                //update current employee with new array of requests
                employeeService.updateEmployee(newEmployee).then( employeeReturned => {
                    console.log('employee dispatched to employee state: ', employeeReturned);
                    dispatch(getEmployee(employeeReturned));
                }).catch( () => {
                    console.log('Employee could not be updated!');
                });
            

                // change requestor's current request's status (update employee)
                // get from db by username
                employeeService.getEmployeeByUsername(request.username).then( employeeReturned => {
                    for (let i = 0; i < employeeReturned.requests.length; i++) {
                        if (request.id === employeeReturned.requests[i].id) {
                            employeeReturned.requests.splice(i, 1);
                            employeeReturned.requests.push(newRequest);
                        }
                    }

                    history.push('/dashboard');
                }).catch( () => {
                    console.log('Error, could not get user from database');
                });
            } else {
                // change request in current employee
                for (let i = 0; i < employee.requests.length; i++) {
                    if (request.id === employee.requests[i].id) {
                        newEmployee.requests.splice(i, 1);
                        newEmployee.requests.push(newRequest);
                    }
                }

                employeeService.updateEmployee(newEmployee).then().catch( () => {
                    dispatch(getEmployee(newEmployee));
                    history.push('/dashboard');
                    console.log('Employee could not be updated!');
                });
            }

            // give request back to employee whose role is mentioned in status
            let arrayReturned = await employeeService.getEmployeeByRole(JSON.parse(roleToPassTo)).then( employees => {
                return employees;
                //make sure to push history to dashboard
            }).catch( () => {
                console.log('Error, could not get supervisor');
            });

            let newArray: Employee[] = [];
            if (arrayReturned) {
                for (const prop in arrayReturned) {
                        newArray.push(arrayReturned[prop]);
                    }
            }
            const newSeniorEmployee = newArray[0];

            newSeniorEmployee.requests.push(newRequest);

            employeeService.updateEmployee(newSeniorEmployee).then( employeeReturned => {
                console.log('employee dispatched to senioremployee state: ', employeeReturned);
                dispatch(getSeniorEmployee(employeeReturned));
                history.push("/dashboard");
            }).catch( () => {
                console.log('Employee could not be updated!');
            });
        }
        
    }

    //this function is for if benco alters reimbursement
    function handleCancelRequestButtonClick() {
        // change status to cancelled
        newRequest.statusOf = 'Cancelled';

        // give credit back to employee
        newEmployee.availableCredit += newRequest.projection;

        // remove request from current employee (update employee)
        // iterate over employee's requests and delete the specific request
        for (let i = 0; i < employee.requests.length; i++) {
            if (request.id === employee.requests[i].id) {
                newEmployee.requests.splice(i, 1);
                newEmployee.requests.push(newRequest);
            }
        }
        //update current employee with new array of requests
        employeeService.updateEmployee(newEmployee).then( employeeReturned => {
            console.log('employee dispatched to employee state: ', employeeReturned);
            dispatch(getEmployee(employeeReturned));
            history.push('/dashboard');
        }).catch( () => {
            console.log('Employee could not be updated!');
        });
    }

    return (
        <Container id="editRequestContainer">
            <Row id="reimbursementForm">
                <Col />
                <Col lg={8}>
                    <Row id="reimbursementHeader">
                        <Col />
                        <Col md="10" className="text-center">
                            <h1>Tuition Reimbursement Form</h1>
                        </Col>
                        <Col />
                    </Row>
                    <Row id="reimbursementBody">
                        <Col>
                            <Form>
                                <Form.Row className="justify-content-md-center">
                                    <Form.Group as={Col} controlId="formDateCreated">
                                            <Form.Label>Today's Date</Form.Label>
                                            <Form.Control type="text" placeholder={request.dateCreated} readOnly/>
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col}>
                                        <Form.Label>First Name</Form.Label>
                                        <Form.Control type="text" placeholder={request.demographics.firstname} readOnly/>
                                        <Form.Label>Last Name</Form.Label>
                                        <Form.Control type="text" placeholder={request.demographics.lastname} readOnly/>
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                        <Form.Label>Phone Number</Form.Label>
                                        <Form.Control type="text" placeholder={request.demographics.phone} readOnly/>
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control type="text" placeholder={request.demographics.email} readOnly/>
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col}>
                                        <Form.Label>Event Type</Form.Label>
                                        <Form.Control type="text" placeholder={request.event.eventType} readOnly >
                                        </Form.Control>
                                        <Form.Label>Projected Reimbursement</Form.Label>
                                        <Form.Control type="text" placeholder={request.projection.toString()} readOnly/>
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                        <Form.Label>Start Date</Form.Label>
                                        <Form.Control type="text" placeholder={request.event.startDate} readOnly/>
                                        <Form.Label>End Date</Form.Label>
                                        <Form.Control type="text" placeholder={request.event.endDate}readOnly/>
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                        <Form.Label>Grading Format</Form.Label>
                                        <Form.Control type="text" placeholder={request.event.gradingFormat}readOnly>
                                        </Form.Control>
                                        <Form.Label>Location</Form.Label>
                                        <Form.Control type="text" placeholder={request.event.location}readOnly/>
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col}>
                                        <Form.Label>Event Description</Form.Label>
                                        <Form.Control  as="textarea" rows={3} placeholder={request.event.description} readOnly/>
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                        <Form.Label>Justification</Form.Label>
                                        <Form.Control as="textarea" rows={3} placeholder={request.justification} readOnly/>
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    {/* if status is Needs Revision */}
                                    {(status === 'Pending' && newRequest.isRevised) || status === 'Cancelled' ? <>
                                    <Form.Group as={Col}><Form.Label>Information Requested</Form.Label>
                                    <Form.Control as="textarea" rows={3} ref={moreInfoRef} placeholder={request.requestInfo} readOnly/>
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                    <Form.Label>Additional Information</Form.Label>
                                    <Form.Control as="textarea" rows={3} ref={resubmitInfoRef}placeholder={request.resubmitInfo} readOnly/>
                                    </Form.Group></>: null }
                                    {(status.includes('Needs Revision') && !newRequest.isRevised) ? <>
                                    <Form.Group as={Col}><Form.Label>Information Requested</Form.Label>
                                    <Form.Control as="textarea" rows={3} ref={moreInfoRef} placeholder={request.requestInfo} readOnly/>
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                    <Form.Label>Additional Information</Form.Label>
                                    <Form.Control as="textarea" rows={3} ref={resubmitInfoRef}/>
                                    {validity.isAdditionalInfoValid ? null : <Form.Text className="alertText">
                                            Error: Please enter additional information.
                                            </Form.Text>}
                                    </Form.Group></>: null }
                                </Form.Row>
                                <Form.Row>
                                    {/* if status is pending */}
                                    {status === 'Pending' && !match ? <Form.Group as={Col}>
                                        <Form.Label>Rejection Reason</Form.Label>
                                        <Form.Control  as="textarea" rows={3}  ref={rejectionRef}/>
                                        {validity.isRejectValid ? null : <Form.Text className="alertText">
                                            Error: Please enter a rejection reason.
                                            </Form.Text>}
                                    </Form.Group> : null }
                                    {status === 'Rejected' ? <Form.Group as={Col}>
                                        <Form.Label>Rejection Reason</Form.Label>
                                        <Form.Control  as="textarea" rows={3}  placeholder={request.rejectInfo} ref={rejectionRef} readOnly/>
                                    </Form.Group> : null }
                                    {/* if status is pending */}
                                    {status === 'Pending' && !match ? <Form.Group as={Col}>
                                        <Form.Label>Select Employee</Form.Label>
                                        <Form.Control type="text" as="select" ref={employeeChoiceRef}>
                                            {juniorEmployees.map( employee => <option key={employee.username} value={employee.username}>{employee.username}</option>)}
                                        </Form.Control>
                                        <Form.Label>Request More Information</Form.Label>
                                        <Form.Control as="textarea" rows={3} ref={moreInfoRef}/>
                                        {validity.isRequestInfoValid ? null : <Form.Text className="alertText">
                                            Error: Please enter a request for more information.
                                            </Form.Text>}
                                    </Form.Group> : null}
                                </Form.Row>
                                <Form.Row id="createRequestButtonRow">
                                    <Col className="d-flex justify-content-center">
                                         {/* red button */}
                                        {status === 'Pending' && !match ? <Button variant="danger" onClick={handleRejectionButtonClick}>
                                            Reject Request
                                        </Button>: null }
                                        {status.includes('Needs Revision') && match ? <Button variant="danger" onClick={handleCancelRequestButtonClick}>
                                            Cancel Request
                                        </Button>: null }
                                    </Col>
                                    <Col className="d-flex justify-content-center">
                                        {/* yellow button */}
                                        <Button variant="warning" onClick={handleGoBackButtonClick}>
                                            Go Back
                                        </Button>
                                    </Col>
                                    <Col className="d-flex justify-content-center">
                                        {/* green button */}
                                        {status === 'Pending' && !match ? 
                                        <Button variant="success" onClick={handleAcceptButtonClick}>
                                            Approve
                                        </Button> : null }
                                        {needsRevision ?
                                        <Button variant="success" onClick={handleResubmitButtonClick} >
                                            Resubmit
                                        </Button> : null }
                                    </Col>
                                    <Col className="d-flex justify-content-center">
                                        {/* blue button */}
                                        {(status === 'Pending' && !match) ?
                                        <Button variant="info" onClick={handleRequestInfoButtonClick}>
                                            Request More Info
                                        </Button> : null }
                                    </Col>
                                </Form.Row>
                            </Form>
                        </Col>
                    </Row>
                </Col>
                <Col />
            </Row>
        </Container>
      );
}

export default EditRequest;