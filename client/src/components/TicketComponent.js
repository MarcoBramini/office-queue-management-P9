import React from 'react';
import { Card, Button, Row } from "react-bootstrap";


class Ticket extends React.Component{
    

    clickEventHandler = function(){
        alert('ticket action placeholder (example, delete ticket reservation)');
    }
    
    render(){

        return (

        <Card className="ml-5 text-center">
            <Card.Header>
                <Card.Title><h3>{`Ticket Number:${this.props.ticket.ticketID}`}</h3></Card.Title>
                <Card.Title>{"ServiceType: "}{this.props.ticket.serviceType}</Card.Title>
            </Card.Header>
            <Card.Body>
                
                <Card.Text className="px-3">
                    <Row>{`Time To Wait: ${this.props.ticket.timeToWait}`}</Row>
                    <Row>{`Service type queue length: ${this.props.ticket.queueLength}`}</Row>
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