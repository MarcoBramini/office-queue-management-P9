const express = require("express");
const { param } = require("express-validator");
const path = require("path");
const cors = require("cors");
const morgan = require('morgan');

const { getTicketsByServiceType, addNewTicket, getServiceType, getServiceType_TodayMaxNumber  } = require("./dao/dao");
const { domainToASCII } = require("url");

const port = process.env.PORT || 3001;

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

app.use("/", express.static(path.resolve(__dirname, "../client/build")));

app.get(
  "/tickets/:serviceTypeId",
  param("serviceTypeId").isString(),
  (req, res) => {
    const serviceTypeId = req.params.serviceTypeId;
    getTicketsByServiceType(serviceTypeId)
      .then((tickets) => {
        res.send(tickets);
      })
      .catch((err) =>
        console.error("error reading data from database: " + err)
      );
  }
);

async function generateTicketNumber(serviceTypeId){
  let ticketNumber;
  //From service_type to label (service type letter)
  await getServiceType(serviceTypeId).then((serviceType)=>{
    ticketNumber = serviceType.ticketLabel;
  }).catch((err)=>{
    console.error(err);
    ticketNumber = null;
  })

  //from service type to today max number + join strings
  return await getServiceType_TodayMaxNumber(serviceTypeId).then(maxNumber=>{
    maxNumber++;
    let formattedNumber = ("0" + maxNumber).slice(-2);//to have number on 2 digits
    ticketNumber = ticketNumber + "" + formattedNumber;
    return ticketNumber;
  }).catch(err=>{
    console.error(err);
  })
}

//Create new ticket
app.post("/tickets", (req, res)=>{
  let serviceType = req.body.serviceType;
  generateTicketNumber(serviceType).then(ticketNumber=>{//if ticket number generated correctly...
    addNewTicket(ticketNumber, serviceType).then((newTicket)=>{//create new ticket with the number
      res.send(newTicket);//return ticket to client
    }).catch((err)=>{
      console.error(err);
    });
  }).catch(err=>{
    console.error(err);
  });
});

app.listen(port, () => {
  console.log(`Server listening at :${port}`);
});

// Export main app for testing
module.exports = app;
