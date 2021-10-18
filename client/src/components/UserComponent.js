import './UserComponentCSS.css';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { React, useState, useEffect } from 'react';
import API from "../API";
import TicketPage from './TicketPageComponent';

function UserPage(props) {
    const [services, setServices] = useState([]);
    const [show, setShow] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [serviceID, setServiceID] = useState(0);
    //let serviceTypes = ['PO box service', 'GPO box service', 'Free Post service', 'Post Bag service', 'e-Post service']

    useEffect(() => {
        API.getServicesTypes().then((newS) => {
          setServices(newS);
        });
      }, [services.length]);

    const getTicket = (event) => {
        setErrorMessage("You have a ticket for '" + services[serviceID].id + "' with this number " + Math.floor(Math.random() * (100 - 0 + 1) + 0)+", new ticket in the list on the left");
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
                        {errorMessage !== '' ? <p>{errorMessage}</p> : ''}

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
                                                    {services.map((m, index) =>
                                                        <option value={index}>{m.id}</option>)}
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
