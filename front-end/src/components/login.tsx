import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { EmployeeState } from '../redux/reducer';
import '../css/login.css';
import { MutableRefObject, SyntheticEvent, useRef } from 'react';
import { getEmployee } from '../redux/actions';
import EmployeeService from '../services/employee.service';
import { Employee } from '../models/employee.model';

function Login() {
    // get state, use redux hooks
    const employee = useSelector((state: EmployeeState) => state.employee);
    console.log('Employee state at beginning of Login:', employee);
    const dispatch = useDispatch();
    const history = useHistory();

    // refs for input fields
    const usernameRef = useRef() as MutableRefObject<HTMLInputElement>;
    const passwordRef = useRef() as MutableRefObject<HTMLInputElement>;

    //handle submit button
    function handleSubmitButtonClick(e: SyntheticEvent) {
        e.preventDefault();
        const newEmployee = {...employee};
        
        if (usernameRef.current.value) {
            newEmployee.username = usernameRef.current.value;
            if(passwordRef.current.value) {
                newEmployee.password = passwordRef.current.value;
                EmployeeService.login(newEmployee).then( (employee: Employee) => {
                    dispatch(getEmployee(employee));
                    history.push('/dashboard');
                }).catch(() => {
                    console.log('User not found!');
                });
            } else {
                console.log('Error, please enter a password.');
            }
        } else {
            console.log('Error, please enter a username.');
        }
    }

    return (
        <Container id="loginContainer">
            <Row>
                <Col />
                <Col lg={8}>
                    <Row className="no-gutters" id="login">
                        <Col xs={2} className="formImage"></Col>
                        <Col id="formCol">
                            <h2>Welcome Back</h2>
                            <Form>
                                <Form.Group controlId="formUsername">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control type="text" ref={usernameRef}  />
                                </Form.Group>
                                <Form.Group controlId="formPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" ref={passwordRef} />
                                </Form.Group>
                                <Button variant="warning" onClick={handleSubmitButtonClick}>
                                    Submit
                                </Button>
                            </Form>
                        </Col>
                    </Row>
                </Col>
                <Col />
            </Row>
        </Container>
      );
}

export default Login;