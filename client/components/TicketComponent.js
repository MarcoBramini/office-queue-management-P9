import React from 'react';
import { Card, Button, Row } from "react-bootstrap";


class Ticket extends React.Component{
    constructor(props){
        super(props);
    }

    clickEventHandler = function(){
        alert('ticket action placeholder (example, delete ticket reservation)');
    }
    
    render(){

        return (

        <Card style={{ marginLeft:"250px", textAlign:"center"}}>
            <Card.Header>
                <Card.Title><h1>{`Ticket Number:${this.props.ticket.ticketID}`}</h1></Card.Title>
                <Card.Title>{"ServiceType: "}{this.props.ticket.serviceType}</Card.Title>
            </Card.Header>
            <Card.Body>
                
                <Card.Text>
                    <Row>{`Time To Wait:${this.props.ticket.timeToWait}`}</Row>
                    <Row>{`Service type queue length:${this.props.ticket.queueLength}`}</Row>
                </Card.Text>
            </Card.Body>
            <Card.Footer>
                <Button action onClick={this.clickEventHandler}>Press Me</Button>
            </Card.Footer>
        </Card>
      );
    }
}

export default Ticket;