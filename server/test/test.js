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
