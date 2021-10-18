exports.ticketsCollection = {
  tickets: [
    {
      _id: "56d9bf92f9be48771d6fe5b1",
      number: "A01",
      serviceTypeId: "bills-payment",
    },
    {
      _id: "56d9bf92f9be48771d6fe5b2",
      number: "A02",
      serviceTypeId: "send-packet",
    },
  ],
};

exports.serviceTypesCollection = {
  "service-types": [
    {
      _id: "61684953a4c9082c6e8dd74a",
      id: "bills-payment",
      counterIDs: ["1", "3", "7"],
      avgServingTime: 30,
      ticketLabel: "A",
    },
  ],
};
