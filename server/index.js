const express = require("express");
const { param } = require("express-validator");
const path = require("path");
const cors = require("cors");
const morgan = require('morgan');

const {
  getTicketsByServiceType,
  getLatestTicketFromCounter,
  changeTicketAsServed,
  recordServeAction,
  getServedTicketsByTicketNumberOnCounterDB,
  getTicketsByID,

  insertServiceType,
  getServiceType,
  getAllServiceTypes,
  addNewTicket,
  getLastNumberEjectedForServiceTypeToday,
} = require("./dao/dao");

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
  return await getLastNumberEjectedForServiceTypeToday(serviceTypeId).then(maxNumber=>{
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

app.get("/serviceTypes", (req, res) => {
  getAllServiceTypes()
    .then((servicetypes) => res.send(servicetypes))
    .catch((err) => console.error("error reading data from database: " + err));
});

// Call latest ticket in the database from spesific counter
// Then update that ticket's status to served
// Finally record that action to another table (called counter-record) for tracking purposes
// So that we can be sure that which ticket is served(also by which counter) and which ticket is still in the queue

//post new serviceType:
app.post("/serviceTypes", (req, res) => {
  const serviceType = req.body;

  insertServiceType(serviceType)
    .then((control) => res.send(control))
    .catch((err) =>
      console.error("error writing data in the database: " + err)
    );
});

//post new serviceType:
app.post("/serviceTypes", (req, res) => {
  const serviceType = req.body;

  insertServiceType(serviceType)
    .then((control) => res.send(control))
    .catch((err) =>
      console.error("error writing data in the database: " + err)
    );
});

//get serviceType
app.get(
  "/serviceTypes/:serviceTypeId",
  param("serviceTypeId").isString(),
  (req, res) => {
    const serviceTypeId = req.params.serviceTypeId;
    getServiceType(serviceTypeId)
      .then((servicetype) => {
        res.send(servicetype);
      })
      .catch((err) =>
        console.error("error reading data from database: " + err)
      );
  }
);

app.get(
  "/tickets/serve/:counterId",
  param("counterId").isString(),
  (req, res) => {
    const counterId = req.params.counterId;
    getLatestTicketFromCounter(counterId)
      .then((tickets) => {
        if (!tickets) {
          //if tickets is null there was no avilable tickets so return null to the client
          res.json(null);
        } else {
          const latestTicket = tickets[0];
          console.log(latestTicket.number + " counterID " + counterId);
          changeTicketAsServed(latestTicket._id);
          recordServeAction(latestTicket.number, counterId);
          res.json(latestTicket);
        }
      })
      .catch((err) =>
        res
          .status(501)
          .json({ error: `Error reading data from database: ${err}` })
      );
  }
);

app.listen(port, () => {
  console.log(`Server listening at :${port}`);
});

// Export main app for testing
module.exports = app;

module.exports.getTicketsByID = getTicketsByID;
module.exports.getServedTicketsByTicketNumberOnCounterDB =
  getServedTicketsByTicketNumberOnCounterDB;
