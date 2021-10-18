const { assert } = require("chai");

let chai = require("chai");
let expect = chai.expect;
let chaiHttp = require("chai-http");

chai.use(chaiHttp);

// This will contain the main server app, needed to listen for requests.
// This is initialized when the mock MongoDB initialization is completed.
let server;

// Init mock MongoDB
const mongoUnit = require("mongo-unit");
let testData = require("./test-data");

mongoUnit.start({ dbName: "office-queue-management" }).then(() => {
  process.env.MONGO_CONN_STR = mongoUnit.getUrl();
  server = require("..");
  run();
});

after(() => {
  return mongoUnit.stop();
});

// Call Ticket API tests
describe("Call ticket Apis testing:", () => {
  describe("GET /tickets/serve/1", () => {
    describe("There is a service with a longer queue than the other", () => {
      beforeEach(() => {
        mongoUnit.load(testData.ticketsCollection);
        mongoUnit.load(testData.serviceTypeCollection);
        mongoUnit.load(testData.counterRecordCollection);
      });

      afterEach(() => mongoUnit.drop());
      it("it should get the ticket from the longest queue served by counter 1", (done) => {
        chai
          .request(server)
          .get("/tickets/serve/1")
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res.status).to.be.equal(200);
            expect(res.body._id).to.be.equal("68914914a4c9082c6e8dd746");
            expect(res.body).to.have.property("status");
            expect(res.body.number).to.be.equal("B01");
            expect(res.body.serviceTypeId).to.be.equal("Test");
            expect(res.body.status).to.be.equal("waiting");
            done();
          });
      });

      it("it should update the ticket's status from waiting to served", (done) => {
        chai
          .request(server)
          .get("/tickets/serve/1")
          .end(async () => {
            const toCheck = await server.getTicketsByID(
              "68914914a4c9082c6e8dd746"
            );
            expect(toCheck.status).to.be.equal("served", toCheck.status);
            done();
          });
      });

      it("it should record in the counter-record table the ticket that is serving", (done) => {
        chai
          .request(server)
          .get("/tickets/serve/1")
          .end(async (err, res) => {
            expect(err).to.be.null;
            expect(res.status).to.be.equal(200);
            const toCheck =
              await server.getServedTicketsByTicketNumberOnCounterDB("B01");
            expect(toCheck).to.be.not.null;
            expect(toCheck.ticketNumber).to.be.equal("B01");
            expect(toCheck.counterId).to.be.equal("1");
            done();
          });
      });
    });

    describe("There are 2 services with the same queue", () => {
      beforeEach(() => {
        mongoUnit.load(testData.ticketsCollection_sameLength);
        mongoUnit.load(testData.serviceTypeCollection);
        mongoUnit.load(testData.counterRecordCollection);
      });
      afterEach(() => mongoUnit.drop());
      it("it should get the ticket from the longest queue served by counter 1", (done) => {
        chai
          .request(server)
          .get("/tickets/serve/1")
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res.status).to.be.equal(200);
            expect(res.body._id).to.be.equal("92914914a4d9082c6e8dd746");
            expect(res.body).to.have.property("status");
            expect(res.body.number).to.be.equal("C01");
            expect(res.body.serviceTypeId).to.be.equal("Testing-stuff");
            expect(res.body.status).to.be.equal("waiting");
            done();
          });
      });

      it("it should update the ticket's status from waiting to served", (done) => {
        chai
          .request(server)
          .get("/tickets/serve/1")
          .end(async (err, res) => {
            const toCheck = await server.getTicketsByID(
              "92914914a4d9082c6e8dd746"
            );
            expect(toCheck.status).to.be.equal("served");
            done();
          });
      });

      it("it should record in the counter-record table the ticket that is serving", (done) => {
        chai
          .request(server)
          .get("/tickets/serve/1")
          .end(async (err, res) => {
            expect(err).to.be.null;
            expect(res.status).to.be.equal(200);
            const toCheck =
              await server.getServedTicketsByTicketNumberOnCounterDB("C01");
            expect(toCheck).to.be.not.null;
            expect(toCheck.ticketNumber).to.be.equal("C01");
            expect(toCheck.counterId).to.be.equal("1");
            done();
          });
      });
    });

    describe("There are no 'waiting' tickets", () => {
      beforeEach(() => {
        mongoUnit.load(testData.ticketsCollection_Empty);
        mongoUnit.load(testData.serviceTypeCollection);
        mongoUnit.load(testData.counterRecordCollection);
      });

      afterEach(() => mongoUnit.drop());
      it("it should return null ", (done) => {
        chai
          .request(server)
          .get("/tickets/serve/1")
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res.status).to.be.equal(200);
            expect(res.body).to.be.null;
            done();
          });
      });
    });
  });
});

// Request Tickets APIs tests
describe("Start Tickets APIs testing:", () => {
  beforeEach(() => mongoUnit.load(testData.ticketsCollection));

  afterEach(() => mongoUnit.drop());

  describe("GET /tickets/bills-payment", () => {
    it("it should retrieve all the tickets associated to the given serviceTypeId", (done) => {
      chai
        .request(server)
        .get("/tickets/bills-payment")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(200);
          expect(res.body.length).to.be.equal(2);
          expect(res.body).to.be.an("array");
          expect(res.body.map((t) => t.serviceTypeId)).to.include.members([
            "bills-payment",
          ]);

          done();
        });
    });
  });
});

describe("login, get user by id and logout", () => {
  beforeEach(() => mongoUnit.load(testData.user));
  afterEach(() => mongoUnit.drop());
  it("login: it should return the user infos", (done) => {
    chai
      .request(server)
      .post("/api/sessions")
      .send({ username: "username01", password: "password01" })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.status).to.be.equal(200);
        expect(res.body.id).to.be.not.null;
        expect(res.body._id).to.be.not.null;
        expect(res.body.role).to.be.not.null;
        expect(res.body.password).to.be.not.null;
        expect(res.body.username).to.be.equal(testData.credentials.username);
        done();
      });
  });

  /*
  it('get current session', (done) => {
    chai
    .request(server)
    .get('/api/sessions/current')
    .end((err, res) => {
      expect(err).to.be.null;
      expect(res.status).to.be.equal(200);
      expect(res.body.id).to.be.not.null;
      expect(res.body._id).to.be.not.null;
      expect(res.body.role).to.be.not.null;
      expect(res.body.password).to.be.not.null;
      expect(res.body.username).to.be.not.null;
      done();
    })
  });
*/

  it("get user by id: it should return the user infos", (done) => {
    chai
      .request(server)
      .get("/api/users/" + testData.user.id)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.status).to.be.equal(200);
        expect(res.body.id).to.be.not.null;
        expect(res.body._id).to.be.not.null;
        expect(res.body.role).to.be.not.null;
        expect(res.body.password).to.be.not.null;
        expect(res.body.username).to.be.not.null;
        done();
      });
  });

  it("logout: res status 200", (done) => {
    chai
      .request(server)
      .delete("/api/sessions/current")
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.status).to.be.equal(200);
        done();
      });
  });
});

// ServiceType APIs tests
describe("Start ServiceTypes APIs testing:", () => {
  before(() => mongoUnit.load(testData.serviceTypesCollection));

  after(() => mongoUnit.drop());

  const testService = {
    id: "Boringstuff",
    counterIDs: ["2", "4", "6"],
    avgServingTime: 15,
    ticketLabel: "B",
  };

  describe("POST /serviceTypes", () => {
    it("it should write the service type to the database ", (done) => {
      //check if Something was written on the DB
      chai
        .request(server)
        .post("/serviceTypes")
        .send(testService)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(200);
          expect(res.body).to.be.an("object", res.body);
          expect(res.body.acknowledged).to.be.equal(true);
          done();
        });
    });

    it("The written record should be equal", (done) => {
      chai
        .request(server)
        .get("/serviceTypes/" + testService.id)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(200);
          expect(res.body).to.be.an("object");
          expect(res.body.id).to.be.equal("Boringstuff");
          expect(res.body.avgServingTime).to.be.equal(15);
          expect(res.body.ticketLabel).to.be.equal("B");
          expect(res.body.counterIDs).to.have.members(["2", "4", "6"]);
          done();
        });
    });
  });

  describe("GET /serviceTypes/:servicetypeId", () => {
    it("it should retrieve the service type associated to the given serviceTypeId", (done) => {
      chai
        .request(server)
        .get("/serviceTypes/bills-payment")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(200);
          expect(res.body).to.be.an("object");
          expect(res.body.id).to.be.equal("bills-payment");
          expect(res.body.avgServingTime).to.be.equal(30);
          expect(res.body.ticketLabel).to.be.equal("A");
          expect(res.body.counterIDs).to.have.members(["1", "3", "7"]);
          done();
        });
    });
  });
});

// ServiceType APIs tests
describe("Start ResetWaitingTickets testing:", () => {
  beforeEach(() => mongoUnit.load(testData.ticketsCollection));

  afterEach(() => mongoUnit.drop());

  it("it should reset all the waiting tickets ", async () => {
    let err = null;

    await server.resetWaitingTickets().catch((e) => (err = e));

    const tickets = await server.getAllTickets().catch((e) => (err = e));
    expect(err).to.be.null;
    expect(tickets.length).to.be.equal(7);
    expect(tickets.map((t) => t.status)).to.include.members(["served"]);

    const resetTickets = tickets.filter((t) => t.status == "expired");
    expect(resetTickets.length).to.be.equal(6);
    for (let rt of resetTickets) {
      expect(rt.resetAt).to.exist;
      expect(rt.resetAt).to.be.not.null;
      expect(rt.resetAt).to.be.not.undefined;
    }
  });
});
