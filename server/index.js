const express = require("express");
const { param } = require("express-validator");
const path = require("path");
const cors = require("cors");

const { getTicketsByServiceType } = require("./dao/dao");
const {
  insertServiceType,
  getServiceType,
  getAllServiceTypes,
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

app.get("/serviceTypes", (req, res) => {
  getAllServiceTypes()
    .then((servicetypes) => res.send(servicetypes))
    .catch((err) => console.error("error reading data from database: " + err));
});

app.listen(port, () => {
  console.log(`Server listening at :${port}`);
});

// Export main app for testing
module.exports = app;
