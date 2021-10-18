"use strict";

const dayjs = require("dayjs");
const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");
const { init } = require("..");

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
    .toArray()
    .catch((err) => {
      console.error("error reading data from database: " + err);
    });
};

// dato un id restituisce l'utente corrispondente
exports.getUserById = async (id) => {
  return await db
    .collection("users")
    .findOne({ id: id }, { projection: { id: 1, username: 1, role: 1 } })
    .catch((err) => {
      console.error("error reading data from database: " + err);
    });
};

exports.getUser = (username, password) => {
  return new Promise((resolve, reject) => {
    db.collection("users").findOne(
      { username: username },
      function (err, user) {
        if (err) {
          console.error("error reading data from database: " + err);
        } else {
          bcrypt.compare(password, user.password).then((result) => {
            if (result) resolve(user);
            else resolve(false);
          });
        }
      }
    );
  });
};

exports.addNewTicket = async (ticketNumber, serviceTypeId) => {
  let newTicket = {
    number: ticketNumber,
    issuedAt: dayjs().format('YYYY-MM-DDTHH:mm:ssZ[Z]'),
    serviceTypeId: serviceTypeId,
    status:"waiting"
  }
  await db
  .collection("tickets")
  .insertOne(newTicket);
  return newTicket;
}

exports.getServiceType = async (serviceTypeId) => {
  return await db
  .collection("service-types")
  .findOne({id: serviceTypeId});
}

//in today tickets,for a service, find the number of the latest ticket
exports.getLastNumberEjectedForServiceTypeToday = async (serviceTypeId) => {
  let now = dayjs().format('YYYY-MM-DD');
  let myregex = "^"+now;

  let youngerTicket_serviceType_today = await db
  .collection("tickets")
  .find({issuedAt:{$regex : myregex}, serviceTypeId: serviceTypeId})
  .sort({issuedAt: -1})
  .limit(1)
  .toArray();
  //console.log(youngerTicket_serviceType_today);

  if(youngerTicket_serviceType_today.length==0)
    return 0;

  let number = youngerTicket_serviceType_today[0].number.substring(1);
  return number;
}
// CALL FOR TICKET OPERATIONS

exports.changeTicketAsServed = async (ticketId) => {
  var newvalue = { $set: { status: "served" } };
  db.collection("tickets").updateOne(
    { _id: ticketId },
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
  const possiblesServices = await db
    .collection("service-types")
    .find({ counterIDs: counterId })
    .toArray();

  //array containing only the names of the service type (easier to work with for the aggregate function)
  const string_possiblesServices = possiblesServices.map(
    (element) => element.id
  );

  //save in count the length of the queue for each service type that our counter can serve
  const count = await db
    .collection("tickets")
    .aggregate([
      {
        $match: {
          serviceTypeId: { $in: string_possiblesServices },
          status: "waiting",
        },
      },
      { $group: { _id: "$serviceTypeId", count: { $sum: 1 } } },
    ])
    .toArray();

  if (!count.length) {
    //if there are no avaiable tickets return null
    return null;
  }

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
        avgServingTime = possiblesServices.filter(
          (toSearch) => toSearch.id == count[indexMax]._id
        )[0].avgServingTime;
      } //if they are the same check the serving times
      else {
        //if they are the same check the serving times
        const toCheck = possiblesServices.filter(
          (toSearch) => toSearch.id == element._id
        )[0].avgServingTime;
        if (toCheck < avgServingTime) {
          //if the serving time is lower than update
          max = element.count;
          indexMax = index;
          avgServingTime = possiblesServices.filter(
            (toSearch) => toSearch.id == count[indexMax]._id
          )[0].avgServingTime;
        }
      }
    }
  });

  return await db
    .collection("tickets")
    .find({ status: "waiting", serviceTypeId: count[indexMax]._id })
    .sort({ issuedAt: 1 })
    .toArray();
};

//used for testing purposes
exports.getTicketsByID = async (id) => {
  return await db.collection("tickets").findOne({ _id: id });
};
//used for testing purposes
exports.getServedTicketsByTicketNumberOnCounterDB = async (number) => {
  return await db
    .collection("counter-record")
    .findOne({ ticketNumber: number });
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

exports.resetWaitingTickets = async () => {
  return await db
    .collection("tickets")
    .updateMany(
      { status: "waiting" },
      { $set: { status: "expired", resetAt: dayjs().toISOString() } }
    );
};

exports.getAllTickets = async () => {
  return await db.collection("tickets").find().toArray();
};
