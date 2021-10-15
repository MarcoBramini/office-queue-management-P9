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
exports.getUserById = async (id) => {
  return await db
    .collection("users")
    .findOne({ id: id }, { projection: { id: 1, username:1, role: 1 } })
    .catch((err) => {
      console.error("error reading data from database: " + err);
    });
};

exports.getUser = (username, password) => {
  return new Promise((resolve, reject) => {
    db.collection("users").findOne({ username: username }, function (err, user) {
      if (err) {
        console.error("error reading data from database: " + err);
      }
      else {
        bcrypt.compare(password, user.password).then(result => {
          if (result)
            resolve(user);
          else
            resolve(false);
        });
      }
    })

  })

};