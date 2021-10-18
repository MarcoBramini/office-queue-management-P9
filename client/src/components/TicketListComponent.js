import React from 'react';
import { Container, ListGroup, Col } from "react-bootstrap";
import Ticket from './TicketComponent';


class TicketList extends React.Component{
   

    selectTickets = ()=>{
      let tickets = this.props.activeTickets;
      return tickets;
    }
    
    render(){
        let ticketsToRender = this.selectTickets();

        return (
            
                    <ListGroup>
                        <Container  className="mt-4">
                        {ticketsToRender?ticketsToRender.map((ticket) => <Col><ListGroup.Item><Ticket ticket={ticket}/></ListGroup.Item><hr></hr></Col> ):null}
                        </Container>
                    </ListGroup>
            

      );
    }
}

export default TicketList;