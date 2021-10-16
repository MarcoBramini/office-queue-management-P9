import React from 'react';
import TicketList from './TicketListComponent';

class TicketPage extends React.Component{
    constructor(props){
        super(props);

        this.state = {
          activeTickets:this.getTickets(),
        }
    }

    getTickets = function(){
      //PLACEHOLDER DATA, api that takes user tickets needed
      let ticket1 = {
          ticketID:'1',
          serviceType:'posta',
          timeToWait:'10h 20m',
          queueLength:12
      };
      let array = [];

      for(let i=0;i<3;i++){
          array.push(ticket1);
      }
      return array;
    }

    getServiceTypes = ()=>{
      //FAKE DATA PLACEHOLDER, CALL AN API
      return ["posta","ritiro","documenti","pagamenti"];
    }

    render(){

        return (
          <TicketList activeTickets={this.state.activeTickets}></TicketList>
      );
    }
}

export default TicketPage;

