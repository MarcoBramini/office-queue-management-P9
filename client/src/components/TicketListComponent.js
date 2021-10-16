import React from 'react';
import { Container, ListGroup, Col, Row } from "react-bootstrap";
import Ticket from './TicketComponent';


class TicketList extends React.Component{
    constructor(props){
        super(props);
    }

    selectTickets = ()=>{
      let tickets = this.props.activeTickets;
      /*console.log(tickets)

      let serviceFilter = this.props.filter;
      console.log(serviceFilter)
      filtro per categoria
      for(let x in serviceFilter){
  
        if(serviceFilter[x] === false){
            tickets = tickets.filter(ticket=>{ return ticket.serviceType != x});
        }
      }
        */
      return tickets;
    }
    
    render(){
        let ticketsToRender = this.selectTickets();

        return (
            
                    <ListGroup>
                        <Container>
                        {ticketsToRender?ticketsToRender.map((ticket) => <Col><ListGroup.Item><Ticket ticket={ticket}/></ListGroup.Item><hr></hr></Col> ):null}
                        </Container>
                    </ListGroup>
            

      );
    }
}

export default TicketList;