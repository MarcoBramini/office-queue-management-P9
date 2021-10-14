const express = require("express");
const cors = require("cors");
const { getTicketsByServiceType } = require("./dao/dao");
const app = express();
const port = 3001;

app.use(cors());

app.get("/tickets/next", (req, res) => {
  getTicketsByServiceType("bills-payment")
    .then((tickets) => {
      res.send(tickets);
    })
    .catch((err) => console.log(err));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
