import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Accordian from './accordian';
import '../css/dashboard.css';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { EmployeeState } from '../redux/reducer';

function Dashboard() {
    // get state, use redux hooks
    const employee = useSelector((state: EmployeeState) => state.employee);
    const history = useHistory();

    //I need to use employee's request array
    const requests = employee.requests;
    

    //create new request button
    function handleButtonClick() {
        history.push("/createrequest");
    }

    return (
        <Container id="dashboardContainer">
            <Row>
                <Col />
                <Col lg={8}>
                    <Row id="dashboardHeader">
                        <Col />
                        <Col md="10" className="text-center">
                            <h1>Requests</h1>
                        </Col>
                        <Col />
                    </Row>
                    <Row id="dashboardBody">
                        <Row id="accordianRow">
                            <Row id="culprit" >
                            {requests.map( request => <Accordian key={request.id} data={request}/>)}
                            </Row>
                        </Row>
                        <Row id="buttonRow">
                            <Col />
                            <Col />
                            <Col>
                            <Button variant="success" onClick={handleButtonClick}>Create new Request</Button>
                            </Col>
                            
                        </Row>
                    </Row>
                </Col>
                <Col />
            </Row>
        </Container>
      );
}

export default Dashboard;