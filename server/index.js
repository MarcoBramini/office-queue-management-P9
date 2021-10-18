const express = require("express");
const { param } = require("express-validator");
const path = require("path");
const cors = require("cors");

const {
  getTicketsByServiceType,
  getLatestTicketFromCounter,
  changeTicketAsServed,
  recordServeAction,
  getServedTicketsByTicketNumberOnCounterDB,
  getTicketsByID,

} = require("./dao/dao");

const port = process.env.PORT || 3001;

const app = express();

app.use(cors());
app.use(express.json());

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

// Call latest ticket in the database from spesific counter
// Then update that ticket's status to served
// Finally record that action to another table (called counter-record) for tracking purposes
// So that we can be sure that which ticket is served(also by which counter) and which ticket is still in the queue

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
      .catch((err) => res.status(501).json({ error: `Error reading data from database: ${err}` })
      );
  }
);

app.listen(port, () => {
  console.log(`Server listening at :${port}`);
});

// Export main app for testing
module.exports = app;
module.exports.getTicketsByID = getTicketsByID;
module.exports.getServedTicketsByTicketNumberOnCounterDB = getServedTicketsByTicketNumberOnCounterDB;
