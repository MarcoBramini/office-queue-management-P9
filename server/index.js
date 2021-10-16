const express = require("express");
const { param } = require("express-validator");
const path = require("path");
const cors = require("cors");

const {
  getTicketsByServiceType,
  getLatestTicketFromCounter,
  changeTicketAsServed,
  recordServeAction,
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

app.get(
  "/tickets/serve/:counterId",
  param("counterId").isString(),
  (req, res) => {
    const counterId = req.params.counterId;
    getLatestTicketFromCounter(counterId)
      .then((tickets) => {
        var latestTicket = tickets[0];
        changeTicketAsServed(latestTicket.number);
        recordServeAction(latestTicket.number, counterId);
        res.send(latestTicket);
      })
      .catch((err) =>
        console.error("error reading data from database: " + err)
      );
  }
);

app.listen(port, () => {
  console.log(`Server listening at :${port}`);
});

// Export main app for testing
module.exports = app;
