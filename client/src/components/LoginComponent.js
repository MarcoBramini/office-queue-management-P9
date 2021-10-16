import './LoginComponentCSS.css';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { React, useState } from 'react';
import {Link} from 'react-router-dom';
import Validator from 'validatorjs';

function LoginForm(props) {
    const [username, setUsername] = useState('officer1');
    const [password, setPassword] = useState('officer1');
    const [errorMessage, setErrorMessage] = useState("");
    const [errorMessageType, setErrorMessageType] = useState("");
    const [reportErrorMessage, setReportErrorMessage] = useState("");

    let data = { username: username, password: password };
    let rules = { username: 'required|alpha_num', password: 'required|min:5' };
    let validation = new Validator(data, rules, {required: "Enter your :attribute", alpha_num: "Username must be alphanumeric", min: "Password must be at least of 6 characters"});

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrorMessage("");
        setErrorMessageType("");
        setReportErrorMessage("");
        if(validation.passes()){
            const credentials = { username, password };
            props.login(credentials)
                .catch((err) => {setReportErrorMessage(err);})
        }
        else{
            if(validation.errors.first('username')){
                setErrorMessage(validation.errors.first('username'));
                setErrorMessageType("username");
            }
            else{
                setErrorMessage(validation.errors.first('password'));
                setErrorMessageType("password");
            }
           // setErrorMessage(validation.errors.first('username')  || validation.errors.first('password'));
        }
        // validazione dei campi inseriti 
        /*let valid = true;
        if (username === '' || password.length < 6) {
            valid = false;
            setErrorMessage('Email cannot be empty and password must be at least six character long.');
            setShow(true);
        }
        if (valid) {
            const credentials = { username, password };
            props.login(credentials)
                .catch((err) => { setErrorMessage(err); setShow(true); })
        }*/
    };
 {/*
    return (
       
        <Container fluid className="vh-100 w-100 px-5 pt-2"  >
            <Row className="mt-4 justify-content-md-center">
                    <div className="loginform">
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label className="mb-3">Username</Form.Label>
                                <div className="d-flex justify-content-center">
                                    <Form.Control type="text" className="w-70" placeholder="Enter username" value={username} onChange={ev => setUsername(ev.target.value)} />
                                </div>
                            </Form.Group>
                            <br />
                            <Form.Group controlId="formBasicPassword">
                                <Form.Label className="mb-3">Password</Form.Label>
                                <div className="d-flex justify-content-center">
                                    <Form.Control type="password" className="w-70" placeholder="Password" value={password} onChange={ev => setPassword(ev.target.value)} />
                                </div>
                            </Form.Group>
                            <br />
                            {show ? <Alert className="w-100" variant="danger" dismissible onClose={() => setShow(false)}>{errorMessage}</Alert> : ''}
                            <Button variant="outline-info" onClick={handleSubmit} className="justify-content-end">Submit</Button>
                        </Form>
                    </div>
            </Row>
        </Container>
        

    )
*/}

    return (
        <Container fluid>
            <Row className="justify-content-md-center" style={{ margin: "40px", padding: "20px" }}>
                <Col></Col>
                <Col id="formBox" xs={10} sm={6} md={6} lg={3} xl={3} style={{ border: "solid 1px rgba(0, 0, 0, 0.13)", borderRadius: "5px" }}>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group style={{ margin: "20px" }}>
                                <h3 style={{textAlign: "center"}}>Login</h3>
                                {reportErrorMessage !== "" ? <div className="error-message"><i className="fas fa-exclamation-triangle"></i>{" "}{reportErrorMessage}</div> : <></>}
                        </Form.Group>

                        <Form.Group style={{ margin: "20px" }} controlId="usernameForm">
                            <Form.Control type="text" placeholder="Enter username" value={username} onChange={ev => setUsername(ev.target.value)}/>
                            {errorMessageType == "username" ? <div className="error-message"><i className="fas fa-exclamation-triangle"></i>{" "}{errorMessage}</div> : <></>}
                        </Form.Group>

                        <Form.Group style={{ margin: "20px" }} controlId="passwordForm">
                            <Form.Control type="password" placeholder="Enter password" value={password} onChange={ev => setPassword(ev.target.value)}/>
                            {errorMessageType == "password" ? <div className="error-message"><i className="fas fa-exclamation-triangle"></i>{" "}{errorMessage}</div> : <></>}
                            <Link style={{ fontSize: "13px", textDecoration: "underline", fontWeight: "580" }} onClick={e => e.preventDefault()}>Forgot your password?</Link>
                        </Form.Group>

                        <Form.Group style={{ margin: "20px" }}>
                            <div className="d-grid gap-2">
                                <Button type="submit" onClick={handleSubmit} variant="primary" size="lg">
                                    Submit
                                </Button>
                            </div>
                        </Form.Group>
                    </Form>
                </Col>
                <Col></Col>
            </Row>
        </Container>

    )
}

export default LoginForm;