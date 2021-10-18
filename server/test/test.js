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
            const toCheck = await server.getTicketsByID("68914914a4c9082c6e8dd746");
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
            const toCheck = await server.getServedTicketsByTicketNumberOnCounterDB("B01");
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
            const toCheck = await server.getTicketsByID("92914914a4d9082c6e8dd746");
            expect(toCheck.status).to.be.equal("served")
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
            const toCheck = await server.getServedTicketsByTicketNumberOnCounterDB("C01");
            expect(toCheck).to.be.not.null;
            expect(toCheck.ticketNumber).to.be.equal("C01");
            expect(toCheck.counterId).to.be.equal("1");
            done();
          });
      });

    });

  });
});
