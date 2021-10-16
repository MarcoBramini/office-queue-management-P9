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

// Tickets APIs tests
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
          expect(res.body.length).to.be.equal(1);
          expect(res.body).to.be.an("array");
          expect(res.body.map((t) => t.serviceTypeId)).to.include.members([
            "bills-payment",
          ]);

          done();
        });
    });
  });
});


// ServiceType APIs tests
describe("Start ServiceTypes APIs testing:", () => {
  beforeEach(() => mongoUnit.load(testData.serviceTypesCollection));

  afterEach(() => mongoUnit.drop());

  const testService={
  "id": "bills-payment",
  "counterIDs": ["2", "4", "6"],
  "avgServingTime": 15,
  "ticketLabel": "B"
  };

  describe("GET /tickets/bills-payment", () => {
    it("it should write the service type to the database ", (done) => {
      chai
        .request(server)
        .post("/servicetypes")
        .send(testService)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(200);
          expect(res.body.length).to.be.equal(1);
          expect(res.body).to.be.an("object");
          expect(res.body.id).to.be.equal(testService.id);
          expect(res.body.counterIDs).to.be.equal(testService.counterIDs);
          expect(res.body.avgServingTime).to.be.equal(testService.avgServingTime);
          expect(res.body.ticketLabel).to.be.equal(testService.ticketLabel);
          done();
        });
    });
  });
});