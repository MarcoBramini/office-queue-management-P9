"use strict";

const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGO_CONN_STR);

const db = client.db("office-queue-management");

client.connect((err, result) => {
  if (err) {
    console.error("error during connection to database: " + err);
  }
});

exports.getTicketsByServiceType = async (serviceTypeId) => {
  return await db
    .collection("tickets")
    .find({ serviceTypeId: serviceTypeId })
    .toArray();
};

// CALL FOR TICKET OPERATIONS

exports.changeTicketAsServed = async (ticketId) => {
  var newvalue = { $set: { status: "served" } };
  db.collection("tickets").updateOne(
    { number: ticketId },
    newvalue,
    function (err, res) {
      if (err) throw err;
      console.log("document updated");
    }
  );
};

exports.recordServeAction = async (ticketId, counterId) => {
  var myRecord = {
    ticketNumber: ticketId,
    counterId: counterId,
    servedAt: new Date(),
  };
  db.collection("counter-record").insertOne(myRecord, function (err, res) {
    if (err) throw err;
    console.log("document inserted");
  });
};

exports.getLatestTicketFromCounter = async (counterId) => {
  return await db.collection("tickets").find({ status: "waiting" }).toArray();
};


exports.getTicketsByID = async (id) => {
  return await db
    .collection("tickets")
    .findOne({ _id: id })
};

exports.getServedTicketsByIdOnCounterDB = async (id) => {
  return await db
    .collection("counter-record")
    .findOne({ _id: id })
};