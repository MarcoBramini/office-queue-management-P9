exports.ticketsCollection = {
  tickets: [
    {
      _id: "56d9bf92f9be48771d6fe5b1",
      number: "A01",
      serviceTypeId: "bills-payment",
      status: "waiting",
    },
    {
      _id: "56d9bf92f9be48771d6fe5b2",
      number: "A02",
      serviceTypeId: "bills-payment",
      status: "waiting",
    },
    {
      _id: "24514914a4c9082c6e8dd746",
      number: "B03",
      issuedAt: "2021-10-15T17:15:00.000Z",
      serviceTypeId: "Test",
      status: "waiting",
    },
    {
      _id: "68914914a4c9082c6e8dd746",
      number: "B01",
      issuedAt: "2021-10-15T17:12:00.000Z",
      serviceTypeId: "Test",
      status: "waiting",
    },
    {
      _id: "18914914a4c9082c6e8dd745",
      number: "B02",
      issuedAt: "2021-10-15T17:12:00.000Z",
      serviceTypeId: "Test",
      status: "waiting",
    },
    {
      _id: "92914914a4d9082c6e8dd746",
      number: "C01",
      issuedAt: "2021-10-15T17:12:00.000Z",
      serviceTypeId: "Testing-stuff",
      status: "waiting",
    },
    {
      _id: "11914914a4c9082c6e8dd746",
      number: "C02",
      issuedAt: "2021-10-15T17:12:00.000Z",
      serviceTypeId: "Testing-stuff",
      status: "served",
    },


  ],
};

exports.ticketsCollection_sameLength = {
  tickets: [
    {
      _id: "56d9bf92f9be48771d6fe5b1",
      number: "A01",
      serviceTypeId: "bills-payment",
      status: "served",
    },
    {
      _id: "68914914a4c9082c6e8dd746",
      number: "B01",
      issuedAt: "2021-10-15T17:12:00.000Z",
      serviceTypeId: "Test",
      status: "waiting",
    },
    {
      _id: "24514914a4c9082c6e8dd746",
      number: "B03",
      issuedAt: "2021-10-15T17:00:00.000Z",
      serviceTypeId: "Test",
      status: "waiting",
    },
    {
      _id: "18914914a4c9082c6e8dd745",
      number: "B02",
      issuedAt: "2021-10-15T17:12:00.000Z",
      serviceTypeId: "Test",
      status: "waiting",
    },
    {
      _id: "92914914a4d9082c6e8dd746",
      number: "C01",
      issuedAt: "2021-10-15T17:12:00.000Z",
      serviceTypeId: "Testing-stuff",
      status: "waiting",
    },
    {
      _id: "11914914a4c9082c6e8dd746",
      number: "C02",
      issuedAt: "2021-10-15T17:12:00.000Z",
      serviceTypeId: "Testing-stuff",
      status: "waiting",
    },
    {
      _id: "56d9bf92f9be48771d6fe5b2",
      number: "C03",
      issuedAt: "2021-10-15T17:40:00.000Z",
      serviceTypeId: "Testing-stuff",
      status: "waiting",
    },


  ],
};

exports.ticketsCollection_Empty = {
  tickets: [ ],
};

exports.serviceTypeCollection = {
  "service-types": [
    {
      _id: "1",
      id: "Test",
      counterIDs: ["1"],
      avgServingTime: "12",
      ticketLabel: "B"
    },
    {
      _id: "2",
      id: "Testing-stuff",
      counterIDs: ["1"],
      avgServingTime: "10",
      ticketLabel: "C"
    },
    {
      _id: "3",
      id: "bills-payment",
      counterIDs: ["1"],
      avgServingTime: "30",
      ticketLabel: "C"
    },
    {
      _id: "4",
      id: "Dont find",
      counterIDs: ["2"],
      avgServingTime: "70",
      ticketLabel: "C"
    },
  ],

};

exports.counterRecordCollection={
  "counter-record":[

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

