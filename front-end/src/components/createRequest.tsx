import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import '../css/createRequest.css';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { EmployeeState, RequestState } from '../redux/reducer';
import { MutableRefObject, SyntheticEvent, useRef } from 'react';
import employeeService from '../services/employee.service';
import { Employee } from '../models/employee.model';
import { changeRequest, getEmployee, getSeniorEmployee } from '../redux/actions';
import requestService from '../services/request.service';
import React from 'react';

function CreateRequest() {
    // get state, use react hooks
    const employee = useSelector((state: EmployeeState) => state.employee);
    //const seniorEmployee = useSelector((state: EmployeeState) => state.seniorEmployee);
    const request = useSelector((state: RequestState) => state.request);
    const dispatch = useDispatch();
    const history = useHistory();

    // validity state
    const [validity, setValidity] =  React.useState({
        isCreateDateValid : true,
        isStartDateValid : true,
        isEndDateValid : true,
        isCostValid : true,
        isLocationValid : true,
        isDescriptionValid : true,
        isJustificationValid : true
    });

    let [projectionState, setProjectionState] = React.useState('');

    //refs for all input fields
    const dateCreatedRef = useRef() as MutableRefObject<HTMLInputElement>;
    const projectionRef = useRef() as MutableRefObject<HTMLInputElement>;
    const availableRef = useRef() as MutableRefObject<HTMLInputElement>;
    const eventTypeRef = useRef() as MutableRefObject<HTMLSelectElement>;
    const locationRef = useRef() as MutableRefObject<HTMLInputElement>;
    const gradingFormatRef = useRef() as MutableRefObject<HTMLSelectElement>;
    const costRef = useRef() as MutableRefObject<HTMLInputElement>;
    const startDateRef = useRef() as MutableRefObject<HTMLInputElement>;
    const endDateRef = useRef() as MutableRefObject<HTMLInputElement>;
    //const gradeCutOffRef = useRef() as MutableRefObject<HTMLInputElement>;
    const justificationRef = useRef() as MutableRefObject<HTMLTextAreaElement>;
    const eventDescriptionRef = useRef() as MutableRefObject<HTMLTextAreaElement>;

    //handle cancel button
    function handleCancelButtonClick() {
        history.push("/dashboard");
    }

    //handle submit button
    async function handleSubmitButtonClick(e: SyntheticEvent) {
        e.preventDefault();
        const newRequest = {...request};
        newRequest.isUrgent = false;
        const newEmployee = {...employee};
        if (dateCreatedRef.current.value) {
            newRequest.dateCreated = dateCreatedRef.current.value;

            // separate created date into usable numbers
            const createdDateStringArray = (dateCreatedRef.current.value).split('-');
            const createdDateNumberArray: number[] = [];
            createdDateStringArray.forEach( string => {
                createdDateNumberArray.push(Number(string));
            });
            const createdDateDay = createdDateNumberArray[2];

            // if valid, reset validity
            setValidity(value => {
                const newValue = {...value, isCreateDateValid : true};
                return newValue;
            });

            if (startDateRef.current.value) {
                // separate start date into usable numbers
                const startDateStringArray = (startDateRef.current.value).split('-');
                const startDateNumberArray: number[] = [];
                startDateStringArray.forEach( string => {
                    startDateNumberArray.push(Number(string));
                });
                const differenceInMillis = Date.parse(`${startDateStringArray[1]}/${startDateStringArray[2]}/${startDateStringArray[0]}`) - Date.parse(`${createdDateStringArray[1]}/${createdDateStringArray[2]}/${createdDateStringArray[0]}`);
                const differenceInDays = differenceInMillis / 86400000;
                
                //start date must be 7 days after creation date
                if (startDateRef.current.value >= dateCreatedRef.current.value) {
                    if (differenceInDays >= 7) {
                        console.log('difference in days', differenceInDays);
                        newRequest.event.startDate = startDateRef.current.value;
                        if (differenceInDays < 14){
                            console.log('Created day: ', createdDateDay);
                            newRequest.isUrgent = true;
                        }
                        console.log('is urgent?', newRequest.isUrgent);

                        // if valid, reset validity
                        setValidity(value => {
                            const newValue = {...value, isStartDateValid : true};
                            return newValue;
                        });

                        if (Number(costRef.current.value)) {
                            // check if number is greater than 0
                            if (Number(costRef.current.value) < 1) {
                                console.log('Error, please enter a valid cost.');
                            } else {
                                // change cost to covered cost
                                let coveredCost = 0;
                                switch (eventTypeRef.current.value) {
                                    case 'University Course':
                                        coveredCost = Number(costRef.current.value)  * .8;
                                        break;
                                    case 'Seminar':
                                        coveredCost = Number(costRef.current.value)  * .6;
                                        break;
                                    case 'Certification Prep Class':
                                        coveredCost = Number(costRef.current.value)  * .75;
                                        break;
                                    case 'Certification':
                                        coveredCost = Number(costRef.current.value);
                                        break;
                                    case 'Technical Training':
                                        coveredCost = Number(costRef.current.value)  * .9;
                                        break;
                                    case 'Other':
                                        coveredCost = Number(costRef.current.value)  * .3;
                                        break;
                                }
                                // check if available credit - cost < 0 --> projection is available credit
                                // available credit = 0
                                if ((newEmployee.availableCredit - coveredCost) <= 0) {
                                    newEmployee.availableCredit = 0;
                                    setProjectionState(projectionState += employee.availableCredit.toString());
                                    projectionRef.current.value = employee.availableCredit.toString();
                                } else {
                                    // else, projection is cost
                                    setProjectionState(projectionState += costRef.current.value);
                                    projectionRef.current.value = coveredCost.toString();
                                    // available credit = available credit - cost
                                    newEmployee.availableCredit -= coveredCost;
                                }
                                newRequest.projection = Number(projectionRef.current.value);

                                if (Number(projectionRef.current.value) === 0) {
                                    console.log('Error, you have no available credit.');
                                } else {
                                    console.log('employee\'s credit is going to be: ', newEmployee.availableCredit);
                                    newRequest.event.cost = Number(costRef.current.value);

                                    // if valid, reset validity
                                    setValidity(value => {
                                        const newValue = {...value, isCostValid : true};
                                        return newValue;
                                    });

                                    if (endDateRef.current.value) {
                                        // make sure end date is on or after the start date
                                        if (endDateRef.current.value < startDateRef.current.value) {
                                            setValidity(value => {
                                                const newValue = {...value, isEndDateValid : false};
                                                return newValue;
                                            });
                                            console.log('Error, please enter a valid end date.');
                                        } else {
                                            newRequest.event.endDate = endDateRef.current.value;
                                            // if valid, reset validity
                                        setValidity(value => {
                                            const newValue = {...value, isEndDateValid : true};
                                            return newValue;
                                        });

                                        if (locationRef.current.value) {
                                            newRequest.event.location = locationRef.current.value;

                                            // if valid, reset validity
                                            setValidity(value => {
                                                const newValue = {...value, isLocationValid : true};
                                                return newValue;
                                            });

                                            if (eventDescriptionRef.current.value) {
                                                newRequest.event.description = eventDescriptionRef.current.value;

                                                // if valid, reset validity
                                                setValidity(value => {
                                                    const newValue = {...value, isDescriptionValid : true};
                                                    return newValue;
                                                });

                                                if (eventTypeRef.current.value) {
                                                    newRequest.event.eventType = eventTypeRef.current.value;


                                                    if (justificationRef.current.value) {
                                                        newRequest.justification = justificationRef.current.value;

                                                        // if valid, reset validity
                                                        setValidity(value => {
                                                            const newValue = {...value, isJustificationValid : true};
                                                            return newValue;
                                                        });
                                                        if (gradingFormatRef.current.value) {
                                                            newRequest.event.gradingFormat = gradingFormatRef.current.value;
                                                            newRequest.id = Date.now();
                                                            newRequest.statusOf = 'Pending';
                                                            newRequest.demographics = employee.demographics;
                                                            newRequest.username = employee.username;

                                                            // change request state
                                                            dispatch(changeRequest(newRequest));
                                                            //get senior employee of current employee
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
                                                            
                                                            // add request to database
                                                            requestService.addRequest(newRequest).then().catch( () => {
                                                                console.log('Error: could not add request to database.');
                                                            });

                                                            newEmployee.requests.push(newRequest);
                                                            newSeniorEmployee.requests.push(newRequest);
                                                            // make changes to DB and update our store
                                                            employeeService.updateEmployee(newEmployee).then( employeeReturned => {
                                                                console.log('employee dispatched to employee state: ', employeeReturned);
                                                                dispatch(getEmployee(employeeReturned));
                                                            }).catch( () => {
                                                                console.log('Employee could not be updated!');
                                                            });
                                                            employeeService.updateEmployee(newSeniorEmployee).then( employeeReturned => {
                                                                console.log('employee dispatched to senioremployee state: ', employeeReturned);
                                                                dispatch(getSeniorEmployee(employeeReturned));
                                                                history.push("/dashboard");
                                                            }).catch( () => {
                                                                console.log('Employee could not be updated!');
                                                            });
                                                        }
                                                    } else {
                                                        setValidity(value => {
                                                            const newValue = {...value, isJustificationValid : false};
                                                            return newValue;
                                                        });
                                                        console.log('Error, please enter a justification.');
                                                    }
                                                } else {
                                                    console.log('Error, please enter an event type.');
                                                }
                                            } else {
                                                setValidity(value => {
                                                    const newValue = {...value, isDescriptionValid : false};
                                                    return newValue;
                                                });
                                                console.log('Error, please enter an event description.');
                                            }
                                        } else {
                                            setValidity(value => {
                                                const newValue = {...value, isLocationValid : false};
                                                return newValue;
                                            });
                                            console.log('Error, please enter a location.');
                                        }
                                        }
                                        
                                        
                                    } else {
                                        setValidity(value => {
                                            const newValue = {...value, isEndDateValid : false};
                                            return newValue;
                                        });
                                        console.log('Error, please enter an end date.');
                                    }
                                }
                                
                            }
                
                        } else {
                            setValidity(value => {
                                const newValue = {...value, isCostValid : false};
                                return newValue;
                            });
                            console.log('Error, please enter a valid number for cost.');
                        }
                    } else {
                        setValidity(value => {
                            const newValue = {...value, isStartDateValid : false};
                            return newValue;
                        });
                        console.log('Error, please enter a valid day at least 7 days after created day.');
                    }
                } else {
                    setValidity(value => {
                        const newValue = {...value, isStartDateValid : false};
                        return newValue;
                    });
                    console.log('Error, please enter a start date a week in advance or greater.');
                }
                
            } else {
                setValidity(value => {
                    const newValue = {...value, isStartDateValid : false};
                    return newValue;
                });
                console.log('Error, please enter a valid day at least 7 days after created day.');
            }
        } else {
            setValidity(value => {
                const newValue = {...value, isCreateDateValid : false};
                return newValue;
            });
            console.log('Error, please enter a creation date.');
        }
    }

    

    return (
        <Container id="createRequestContainer">
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
                                            <Form.Control type="date" ref={dateCreatedRef}/>
                                            {validity.isCreateDateValid ? null : <Form.Text className="alertText">
                                            Error: Please enter a valid creation date.
                                            </Form.Text>}
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col}>
                                        <Form.Label>First Name</Form.Label>
                                        <Form.Control type="text" placeholder={employee.demographics.firstname} readOnly/>
                                        <Form.Label>Last Name</Form.Label>
                                        <Form.Control type="text" placeholder={employee.demographics.lastname} readOnly/>
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                        <Form.Label>Phone Number</Form.Label>
                                        <Form.Control type="text" placeholder={employee.demographics.phone} readOnly/>
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control type="text" placeholder={employee.demographics.email} readOnly/>
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col}>
                                        <Form.Label>Available Credit</Form.Label>
                                        <Form.Control type="text" ref={availableRef} placeholder={employee.availableCredit.toString()} readOnly/>
                                        <Form.Label>Cost</Form.Label>
                                        <Form.Control type="number" min={1} max={1000} ref={costRef} />
                                        {validity.isCostValid ? null : <Form.Text className="alertText">
                                            Error: Please enter a valid cost.
                                            </Form.Text>}
                                        <Form.Label>Projected Reimbursement</Form.Label>
                                        <Form.Control type="text" ref={projectionRef} readOnly />
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                    <Form.Label>Event Type</Form.Label>
                                        <Form.Control as="select" ref={eventTypeRef}>
                                            <option value="University Course">University Course</option>
                                            <option value="Seminar">Seminar</option>
                                            <option value="Certification Prep Class">Certification Prep Class</option>
                                            <option value="Certification">Certification</option>
                                            <option value="Technical Training">Technical Training</option>
                                            <option value="Other">Other</option>
                                        </Form.Control>
                                        <Form.Label>Start Date</Form.Label>
                                        <Form.Control type="date" ref={startDateRef} />
                                        {validity.isStartDateValid ? null : <Form.Text className="alertText">
                                            Error: Please enter a valid start date that is at least a week from create date.
                                            </Form.Text>}
                                        <Form.Label>End Date</Form.Label>
                                        <Form.Control type="date" ref={endDateRef} />
                                        {validity.isEndDateValid ? null : <Form.Text className="alertText">
                                            Error: Please enter a valid end date.
                                            </Form.Text>}
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                        <Form.Label>Grading Format</Form.Label>
                                        <Form.Control type="text" as="select" ref={gradingFormatRef}>
                                            <option value="Letter">Letter</option>
                                            <option value="Percentage">Percentage</option>
                                            <option value="None">None</option>
                                        </Form.Control>
                                        <Form.Label>Location</Form.Label>
                                        <Form.Control type="text" ref={locationRef} />
                                        {validity.isLocationValid ? null : <Form.Text className="alertText">
                                            Error: Please enter a valid location.
                                            </Form.Text>}
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col}>
                                        <Form.Label>Event Description</Form.Label>
                                        <Form.Control  as="textarea" rows={3} ref={eventDescriptionRef} />
                                        {validity.isDescriptionValid ? null : <Form.Text className="alertText">
                                            Error: Please enter a valid description.
                                            </Form.Text>}
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                        <Form.Label>Justification</Form.Label>
                                        <Form.Control as="textarea" rows={3} ref={justificationRef} />
                                        {validity.isJustificationValid ? null : <Form.Text className="alertText">
                                            Error: Please enter a valid justification.
                                            </Form.Text>}
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row id="createRequestButtonRow">
                                    <Col className="d-flex justify-content-center">
                                        <Button variant="danger" onClick={handleCancelButtonClick}>
                                            Cancel
                                        </Button>
                                    </Col>
                                    <Col className="d-flex justify-content-center">
                                        <Button variant="warning" type="submit" onClick={handleSubmitButtonClick}>
                                            Submit
                                        </Button>
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

export default CreateRequest;