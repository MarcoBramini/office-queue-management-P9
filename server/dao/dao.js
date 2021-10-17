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
    issuedAt: dayjs().toDate(),
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

//in today tickets,for a service, find the max ticket number
exports.getServiceType_TodayMaxNumber = async (serviceTypeId) => {

  //all tickets of a service type
  let tickets_ServiceType = await db //TODO: may change this with getTicketsByServiceType function
  .collection("tickets")
  .find({serviceTypeId: serviceTypeId}).toArray();

  //all today tickets of the service type
  let tickets_ServiceType_day = tickets_ServiceType.filter((ticket)=>{
    return dayjs().isSame(dayjs(ticket.issuedAt),"day") == true;
  });

  if(tickets_ServiceType_day.length==0)
    return 0;

  let ticketsNumbers = tickets_ServiceType_day.map(ticket=>ticket.number);
  return ticketsNumbers.reduce((max, ticketNumber)=>{
    let x = ticketNumber.substring(1);
    if(x>max)
      return x;
    return max;
  }, 0);
}