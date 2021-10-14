"use strict";

const { MongoClient } = require("mongodb");

const mongo_uri =
  "mongodb+srv://test:test@office-queue-management.n5k3k.mongodb.net/test";
const client = new MongoClient(mongo_uri);

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
    .toArray()
    .catch((err) => {
      console.error("error reading data from database: " + err);
    });
};
