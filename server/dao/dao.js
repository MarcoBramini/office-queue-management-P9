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
  //save in possibleServices only the services that the counter can serve
  const possiblesServices = await db.collection("service-types").find({ counterIDs: counterId }).toArray();
  
  //array containing only the names of the service type (easier to work with for the aggregate function)
  const string_possiblesServices = possiblesServices.map((element) => element.id);

  //save in count the length of the queue for each service type that our counter can serve
  const count = await db.collection("tickets").aggregate([
    { $match: { serviceTypeId: { $in: string_possiblesServices }, status: "waiting" } },
    { $group: { _id: "$serviceTypeId", count: { $sum: 1 } } }
  ]).toArray();

  //searching for the longest queue
  //indexmax is the position in the array count of where the max is, 
  //max is the max value of the queue & avgServingTime is the avgServingTime associated to the longest queue
  let indexMax = 0;
  let max = 0;
  let avgServingTime = 100000;
  count.forEach((element, index) => {
    //check if it's higher or equal
    if (element.count >= max) {
      //check if they are the same
      if (element.count != max) {
        //if not update
        max = element.count;
        indexMax = index;
        avgServingTime = possiblesServices.filter((toSearch) => toSearch.id == count[indexMax]._id)[0].avgServingTime;
      }//if they are the same check the serving times
      else {

        //if they are the same check the serving times
        const toCheck = possiblesServices.filter((toSearch) => toSearch.id == element._id)[0].avgServingTime;
        if (toCheck < avgServingTime) {
          //if the serving time is lower than update
          max = element.count;
          indexMax = index;
          avgServingTime = possiblesServices.filter((toSearch) => toSearch.id == count[indexMax]._id)[0].avgServingTime;
        }
      }

    }

  });

  return await db.collection("tickets").find({ status: "waiting", serviceTypeId: count[indexMax]._id }).sort({ number: 1 }).toArray();
};

//used for testing purposes
exports.getTicketsByID = async (id) => {
  return await db
    .collection("tickets")
    .findOne({ _id: id })
};
//used for testing purposes
exports.getServedTicketsByTicketNumberOnCounterDB = async (number) => {
  return await db
    .collection("counter-record")
    .findOne({ ticketNumber: number })
};