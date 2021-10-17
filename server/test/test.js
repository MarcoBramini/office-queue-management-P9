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
  beforeEach(() => mongoUnit.load(testData.ticketsCollection));

  afterEach(() => mongoUnit.drop());

  describe("GET /tickets/serve/1", () => {
    it("it should get the latest ticket for counter 1 and changed its status to served", (done) => {
      chai
        .request(server)
        .get("/tickets/serve/1")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.be.equal(200);
          expect(res.body).to.have.property("status");
          expect(res.body).to.have.property("number");
          expect(res.body).to.have.property("serviceTypeId");
          expect(res.body.status).to.be.equal("waiting");

          done();
        });
    });
  });
});
