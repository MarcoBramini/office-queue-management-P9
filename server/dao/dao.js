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

exports.insertServiceType = async (servicetype) => {
  return await db.collection("service-types").insertOne({
    id: servicetype.id,
    counterIDs: [...servicetype.counterIDs],
    avgServingTime: servicetype.avgServingTime,
    ticketLabel: servicetype.ticketLabel,
  });
};

exports.getServiceType = async (serviceTypeId) => {
  return await db.collection("service-types").findOne({ id: serviceTypeId });
};

exports.getAllServiceTypes = async (serviceTypeId) => {
  return await db.collection("service-types").find().toArray();
};
