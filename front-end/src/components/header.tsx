import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import '../css/header.css';
import { useSelector, useDispatch } from 'react-redux';
import { EmployeeState } from '../redux/reducer';
import { NavLink } from 'react-router-dom';
import employeeService from '../services/employee.service';
import { getEmployee } from '../redux/actions';
import { Employee } from '../models/employee.model';

function Header() {
    const employee = useSelector((state: EmployeeState) => state.employee);
    console.log('Employee state according to Header Component:', employee);
    let newEmployee = {...employee};
    if (!employee) {
        newEmployee = new Employee();
    }

    const dispatch = useDispatch();

    function logout() {
        console.log('User clicked logout');
        employeeService.logout().then(() => {
            dispatch(getEmployee(new Employee()));
        });
    }

    return (
        <Container fluid id="header">
            <Row className='align-items-center'>
                <Col md={2} />
                <Col md={8} className="center-align">
                    <h1>Rocketeer</h1>
                    <h6>Tuition Reimbursement System</h6>
                </Col>
                <Col md={2} className="center-align">
                {newEmployee.demographics.phone ? (<NavLink to="/login" className="active inactive" onClick={logout}>Logout</NavLink>) : (null)}
                </Col>
            </Row>
        </Container>
      );
}

export default Header;