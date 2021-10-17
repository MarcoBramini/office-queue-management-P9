import React, { useState } from "react";
import { Container, Row, Col, Alert, Button, Spinner } from "react-bootstrap";
import ManagerPage from "./components/ManagerPage";
function App() {
  const [ticket, setTicket] = useState({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function onButtonClick() {
    setIsLoading(true);
    fetch("/tickets/bills-payment")
      .then((response) => {
        response.json().then((data) => setTicket(data[0]));
      })
      .catch((err) => setError(err))
      .finally(() => setIsLoading(false));
  }

  return (
    <Container>
      <ManagerPage />
    </Container>
  );
}

export default App;
