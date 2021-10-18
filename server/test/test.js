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

describe('login, get user by id and logout', () => {
  beforeEach(() => mongoUnit.load(testData.user));
  afterEach(() => mongoUnit.drop());
  it('login: it should return the user infos', (done) => {
    chai
      .request(server)
      .post("/api/sessions")
      .send(
        {username: "username01", password: "password01"}
      )
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.status).to.be.equal(200)
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
  
  it('get user by id: it should return the user infos', (done) => {
    chai
    .request(server)
    .get("/api/users/"+testData.user.id)
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
  

  it('logout: res status 200', (done) => {
    chai
    .request(server)
    .delete('/api/sessions/current')
    .end((err, res) => {
      expect(err).to.be.null;
      expect(res.status).to.be.equal(200);
      done();
    })
  })
});
