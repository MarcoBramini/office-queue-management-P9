const express = require("express");
const { param } = require("express-validator");
const path = require("path");
const cors = require("cors");

const {
  getTicketsByServiceType,
  updateTicketCounter,
  getTicketById,
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

app.post("/tickets/:ticketId", (req, res) => {
  const ticketId = req.params.ticketId;
  const newCounterId = req.body.counterId;

  updateTicketCounter(ticketId, newCounterId)
    .then(() => res.status(200).end())
    .catch((e) => console.error(e));
});

app.listen(port, () => {
  console.log(`Server listening at :${port}`);
});

// Export main app for testing
module.exports = app;
module.exports.getTicketById = getTicketById;
