import "./App.css";
import React, { useState } from "react";
import { Container, Row, Col, Alert, Button, Spinner } from "react-bootstrap";

function App() {
  const [ticket, setTicket] = useState({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function onButtonClick() {
    setIsLoading(true);
    fetch("http://localhost:3001/tickets/next")
      .then((response) => {
        response.json().then((data) => setTicket(data[0]));
      })
      .catch((err) => setError(err))
      .finally(() => setIsLoading(false));
  }

  return (
    <Container>
      <Row className='vh-100 justify-content-center align-items-center'>
        <Col className='d-flex justify-content-center align-items-center flex-column'>
          {isLoading ? (
            <Spinner animation='border' variant='primary' />
          ) : (
            <>
              <Button onClick={onButtonClick}>Call next ticket!</Button>
              <h1>{ticket.number}</h1>
              {error ? <Alert>{error}</Alert> : null}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default App;
