import { Dropdown, Button } from "react-bootstrap";
import { useState } from "react";
import API from "../API";
export default function OfficerPage() {
  const [counterId, setCounterId] = useState("");
  const [currentTicket, setCurrentTicket] = useState({});
  const [message, setMessage] = useState("");
  const [warning, setWarning] = useState("");

  const handleCounter = (id) => {
    setCounterId(id);
  };

  const callNextTicket = () => {
    if (counterId === "") {
      setMessage("");
      setWarning("Please choose counter first!");
    } else {
      API.callNextTicket(counterId).then((ticket) => {
        setCurrentTicket(ticket);
        console.log(ticket);
        setWarning("");
        setMessage("You are serving Ticket number : " + ticket.number);
      });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",

        marginTop: "200px",
      }}
    >
      <div className="Col">
        <div className="Row">
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Choose Counter
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item
                onClick={() => {
                  handleCounter("1");
                }}
                eventKey="1"
              >
                1
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  handleCounter("2");
                }}
                eventKey="2"
              >
                2
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  handleCounter("3");
                }}
                eventKey="3"
              >
                3
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  handleCounter("4");
                }}
                eventKey="4"
              >
                4
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  handleCounter("5");
                }}
                eventKey="5"
              >
                5
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  handleCounter("6");
                }}
                eventKey="6"
              >
                6
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  handleCounter("7");
                }}
                eventKey="7"
              >
                7
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className="Row" style={{ marginTop: "10px" }}>
          <i style={{ fontSize: "15px" }}>Counter Id : {counterId}</i>
        </div>

        <div className="Row" style={{ marginTop: "50px" }}>
          <Button onClick={callNextTicket} style={{ width: "100%" }}>
            Call Ticket
          </Button>
        </div>

        <div className="Row">
          <h4 style={{ fontSize: "15px" }}>{message}</h4>
          <h4 style={{ color: "red", fontSize: "15px" }}>{warning}</h4>
        </div>
      </div>
    </div>
  );
}
