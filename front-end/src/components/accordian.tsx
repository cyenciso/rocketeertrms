import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import '../css/accordian.css';
import React, { SyntheticEvent } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Request} from '../models/request.model';
import { changeRequest } from '../redux/actions';
import { EmployeeState } from '../redux/reducer';

interface AccordianProps {
    key: number;
    data: Request;
}

function Accordian(props: AccordianProps) {
    const employee = useSelector((state: EmployeeState) => state.employee);
    const dispatch = useDispatch();
    const history = useHistory();
    let status = props.data.statusOf;

    // if needs revision
    if (props.data.statusOf.includes('Needs Revision')) {
        // from someone other than employee
        const wordArray = props.data.statusOf.split(' ');
        let username = wordArray[3];
        if (username !== employee.username) {
            status = 'Needs revision by ' + username;
        } else {
            status = 'Needs Revision';
        }
    }
    

    async function handleButtonClick(e: SyntheticEvent) {
        e.preventDefault();
        dispatch(changeRequest(props.data));
        history.push("/editrequest");
    }
    
    return (
        <Container className="accordian">
            <Row className='align-items-center dataRow'>
                <Col>{props.data.id}</Col>
                <Col>{props.data.demographics.firstname} {props.data.demographics.lastname}</Col>
                <Col>{status}</Col>
                <Col id="urgentCol">{props.data.isUrgent && (props.data.statusOf === 'Pending' || props.data.statusOf.includes('Needs Revision')) ? 'Urgent' : null }</Col>
                <Col><NavLink to="/editrequest" onClick={handleButtonClick}>View/Edit</NavLink></Col>
            </Row>
        </Container>
    );

};

export default Accordian;