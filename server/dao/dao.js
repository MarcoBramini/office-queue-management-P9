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

exports.updateTicketCounter = async (ticketId, counterId) => {
  return await db
    .collection("tickets")
    .updateOne({ _id: ticketId }, { $set: { counterId, counterId } });
};

exports.getTicketById = async (ticketId) => {
  console.log(process.env.MONGO_CONN_STR);
  return await db.collection("tickets").findOne({ _id: ticketId });
};
