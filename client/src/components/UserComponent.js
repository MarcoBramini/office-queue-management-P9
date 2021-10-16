import './UserComponentCSS.css';
import { Form, Button, Container, Alert, Row, Col } from 'react-bootstrap';
import { React, useState } from 'react';
import TicketPage from './TicketPageComponent';

function UserPage(props) {
    const [show, setShow] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [serviceID, setServiceID] = useState(0);
    let serviceTypes = ['PO box service', 'GPO box service', 'Free Post service', 'Post Bag service', 'e-Post service']

    const getTicket = (event) => {
        setErrorMessage("You have a ticket for '" + serviceTypes[serviceID] + "' with this number " + Math.floor(Math.random() * (100 - 0 + 1) + 0));
        setShow(false);
    };
    const handlerServiceChanged = (event) => {
        setServiceID(event.target.value);
    }

    return (
        <Container fluid>
            <Row>
                <Col>
                    <TicketPage />
                </Col>
                <Col>
                    <div className=" my-5 d-flex justify-content-center align-items-center flex-column">
                        {!show ? <Button className="mb-3" onClick={() => { setShow(true); setErrorMessage('') }}>Get a ticket!</Button> : <Button className="mb-3" disabled>Get a ticket!</Button>}
                        {errorMessage != '' ? <p>{errorMessage}</p> : ''}

                        {show ?
                            <Container fluid >
                                <Row className=" d-flex justify-content-center align-items-center flex-column mt-4" >
                                    <Col></Col>
                                    <Col id="formBox" xs={10} className="py-4 px-5" >
                                        <Row >
                                            <Col >
                                                <h3>Get a ticket!</h3>
                                            </Col>
                                            <Col className="d-flex justify-content-end mb-2">
                                                <Button variant="outline-primary" onClick={() => setShow(false)}>x</Button>
                                            </Col>
                                        </Row>
                                        <Row >
                                            <h6>Choose the service type:</h6>
                                        </Row>
                                        <Row className=" mb-4">
                                            <Col >
                                                <Form.Select size="lg" onChange={e => handlerServiceChanged(e)}>
                                                    {serviceTypes.map((m, index) =>
                                                        <option value={index}>{m}</option>)}
                                                </Form.Select>
                                            </Col>
                                        </Row>
                                        <Row className="my-2 px-2">
                                            <Button onClick={getTicket}>Send request</Button>
                                        </Row>
                                    </Col>
                                </Row>

                            </Container>
                            : ''}
                    </div>
                </Col>
            </Row>
        </Container>


    )
}

export { UserPage };