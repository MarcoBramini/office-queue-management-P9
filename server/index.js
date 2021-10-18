const express = require("express");
const morgan = require('morgan'); // middleware di logging
const passport = require('passport'); // middleware di autenticazione 
const LocalStrategy = require('passport-local').Strategy; // username e password per il login
const session = require('express-session'); // abilita le sessioni
const cors = require("cors");
const { param } = require("express-validator");
const path = require("path");
const { getTicketsByServiceType, getUser, getUserById } = require("./dao/dao");

/*** impostiamo Passport ***/
// impostiamo la strategia di login "username e password"
// impostando una funzione che verifica username e password 
passport.use(new LocalStrategy(
  function (username, password, done) {
    getUser(username, password).then((user) => {
      if (!user)
        return done(null, false, { message: 'Incorrect username and/or password.' });
      return done(null, user);
    })
  }
));

// inizializziamo express
const app = express();
const port = process.env.PORT || 3001;

// impostiamo la sessione
app.use(session({
  // di default, Passport usa una MemoryStore per tener traccia delle sessioni 
  secret: 'P09 best group',
  resave: false,
  saveUninitialized: false
}));

// dopodichè, inizializziamo passport
app.use(passport.initialize());
app.use(passport.session());

// serializziamo e de-serializziamo l'utente (oggetto utente <-> sessione)
// serializziamo l'id dell'utente e lo salviamo nella sessione: la sessione in questo modo è molto piccola
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// partendo dai dati nella sessione, estraiamo l'utente corrente (loggato) 
passport.deserializeUser((id, done) => {
  getUserById(id)
    .then(user => {
      done(null, user); // questo sarà disponibile in req.user
    }).catch(err => {
      done(err, null);
    });
});

// impostiamo i middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use("/", express.static(path.resolve(__dirname, "../client/build")));

// middleware creato da noi: controlla se una data richiesta proviene da un utente autenticato
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated())
    return next();
  return res.status(401).json({ error: 'not authenticated' });
}

// DELETE /sessions/current 
// logout
app.delete('/api/sessions/current', (req, res) => {
  req.logout();
  res.end();
});

// POST /sessions 
// login
app.post('/api/sessions', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
    if (!user) {
      // mostriamo il messaggio di errore nel login 
      return res.status(401).json(info);
    }
    // in caso di successo facciamo il login 
    req.login(user, (err) => {
      if (err)
        return next(err);
      // req.user contiene l'utente autenticato, madiamo indetro tutte le informazioni 
      // relative a quell'utente provenienti da userDao.getUser()
      return res.json(req.user);
    });
  })(req, res, next);
});

// GET /sessions/current
// controlla se l'utente è loggato o meno
app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  }
  else{
    res.status(401).json({ error: 'Unauthenticated user!' });
  }
    
});

// GET /api/users/:id
// dato l'id restituisce l'utente relativo 
app.get('/api/users/:id', (req, res) => {
  getUserById(req.params.id)
    .then((user) => {
      res.send(user);
    })
    .catch((err) => console.log(err));
});

app.get("/tickets/next", (req, res) => {
  getTicketsByServiceType("bills-payment")
    .then((tickets) => {
      res.send(tickets);
    })
    .catch((err) => console.log(err));
});

app.get(
  "/tickets/:serviceTypeId",
  param("serviceTypeId").isString(),
  (req, res) => {
    const serviceTypeId = req.params.serviceTypeId;
    getTicketsByServiceType(serviceTypeId)
      .then((tickets) => {
        res.send(tickets);
      })
      .catch((err) =>
        console.error("error reading data from database: " + err)
      );
  }
);

app.listen(port, () => {
  console.log(`Server listening at :${port}`);
});

// Export main app for testing
module.exports = app;