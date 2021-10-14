"use strict";

const { MongoClient } = require("mongodb");
const bcrypt = require('bcrypt');

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

// dato un id restituisce l'utente corrispondente 
exports.getUserByUsername = async (username) => {
  return await db
    .collection("users")
    .findOne({ username: username })
    .catch((err) => {
      console.error("error reading data from database: " + err);
    });
};

exports.getUser = async (username, password) => {
  const myUser = await db.collection("users").findOne({ username: username });

  if (myUser) {
    const user = { username: myUser.username, role: myUser.role};
  }
  else {
    console.error("error reading data from database: " + err);
  }

  return  myUser;
};