"use strict";

const dayjs = require('dayjs')

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
exports.getServiceType_TodayMaxNumber = async (serviceTypeId) => {
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