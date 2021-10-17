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
