import { useEffect, useState } from "react";
import API from "../API";
import { Form, Button } from "react-bootstrap";
export default function ManagerPage() {
  const [services, setServices] = useState([]);
  const [counters, setCounters] = useState([]);
  const [newService, setNewService] = useState({
    id: "",
    counterIDs: [],
    avgServingTime: "",
    ticketLabel: "",
  });
  const createNewService = (service) => {
    API.postNewServiceType(service);
  };

  useEffect(() => {
    API.getServicesTypes().then((newS) => {
      setServices(newS);
    });
  }, [services]);

  const handleSubmit = (e) => {
    e.preventDefault();

    setNewService({ ...newService, counterIDs: [...counters] });

    createNewService(newService);
  };

  const onCounterChange = (e) => {
    if (counters.includes(e.target.value)) {
      const filteredArray = counters.filter((item) => item !== e.target.value);

      setCounters(filteredArray);
    } else {
      setCounters((oldCounters) => [...oldCounters, e.target.value]);
    }
  };

  const onInputChange = (e) => {
    setNewService({ ...newService, [e.target.name]: e.target.value });
  };

  const { id, avgServingTime, ticketLabel } = newService;

  return (
    <div className="container" style={{ marginTop: "50px" }}>
      <div className="row">
        <div className="col" style={{ backgroundColor: "#C1F4D7" }}>
          {" "}
          <h1>Current Available Services</h1>{" "}
          <ul
            style={{
              listStyleType: "upper-roman",
              fontFamily: "Roboto",
              marginTop: "25px",
            }}
          >
            {services.map((service) => (
              <li
                style={{
                  fontSize: "25px",
                  marginBottom: "10px",
                  color: "#1D35BD",
                }}
                key={service.id}
              >
                {service.id}{" "}
                <i>
                  <h6 style={{ color: "#272B42" }}>
                    LABEL : {service.ticketLabel}, average time :{" "}
                    {service.avgServingTime}
                  </h6>
                </i>
              </li>
            ))}
          </ul>
        </div>

        <div className="col" style={{ backgroundColor: "#C1F4F3" }}>
          {" "}
          <h1> Create New Service</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Service Name"
                name="id"
                value={id}
                onChange={(e) => onInputChange(e)}
                required
              />
            </Form.Group>
            <br />
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Ticket Label"
                name="ticketLabel"
                value={ticketLabel}
                onChange={(e) => onInputChange(e)}
                required
              />
            </Form.Group>

            <br />
            <Form.Group>
              <Form.Control
                type="number"
                placeholder="Average Serving Time"
                name="avgServingTime"
                value={avgServingTime}
                onChange={(e) => onInputChange(e)}
                required
              />
            </Form.Group>

            <br />
            <h4>Choose Counter ID's</h4>

            <Form.Group style={{ marginTop: "10px" }}>
              <Form.Check
                inline
                label="1"
                name="group1"
                type={"checkbox"}
                id={"1"}
                value={"1"}
                onChange={(e) => onCounterChange(e)}
              />
              <Form.Check
                inline
                label="2"
                name="group1"
                type={"checkbox"}
                id={"2"}
                value={"2"}
                onChange={(e) => onCounterChange(e)}
              />
              <Form.Check
                inline
                name="group1"
                label="3"
                type={"checkbox"}
                id={"3"}
                value={"3"}
                onChange={(e) => onCounterChange(e)}
              />
              <Form.Check
                inline
                name="group1"
                label="4"
                type={"checkbox"}
                id={"4"}
                value={"4"}
                onChange={(e) => onCounterChange(e)}
              />
              <Form.Check
                inline
                name="group1"
                label="5"
                type={"checkbox"}
                id={"5"}
                value={"5"}
                onChange={(e) => onCounterChange(e)}
              />
              <Form.Check
                inline
                name="group1"
                label="6"
                type={"checkbox"}
                id={"6"}
                value={"6"}
                onChange={(e) => onCounterChange(e)}
              />
              <Form.Check
                inline
                name="group1"
                label="7"
                type={"checkbox"}
                id={"7"}
                value={"7"}
                onChange={(e) => onCounterChange(e)}
              />
            </Form.Group>

            <Button
              variant="success"
              type="submit"
              size="lg"
              className="mt-3"
              style={{
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              Create
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}
