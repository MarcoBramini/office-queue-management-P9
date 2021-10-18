// USER API

// permette ad un utente (già registrato) di effettuare il login
// ritorna l'utente (id, username, name) corrispondente a username/password inseriti
async function logIn(credentials) {
  let response = await fetch("/api/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  if (response.ok) {
    const user = await response.json();
    return user;
  } else {
    try {
      const errDetail = await response.json();
      throw errDetail.message;
    } catch (err) {
      throw err;
    }
  }
}

// permette ad un utente di effettuare il logout
async function logOut() {
  await fetch("/api/sessions/current", { method: "DELETE" });
}

// restituisce informazioni relative all'utente loggato (id, username, name)
async function getUserInfo() {
  const response = await fetch("api/sessions/current");
  const userInfo = await response.json();
  if (response.ok) {
    return userInfo;
  } else {
    throw userInfo; // un oggetto che contiene l'errore proveniente dal server
  }
}

async function callNextTicket(counterId) {
  const response = await fetch("tickets/serve/" + counterId);

  const ticket = await response.json();

  return ticket;
}

async function postNewServiceType(newService) {
  const response = await fetch("serviceTypes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...newService }),
  });

  if (response.ok) return null;
  else return { err: "post error" };
}

async function getServicesTypes() {
  const response = await fetch("serviceTypes");
  const services = await response.json();

  return services;
}

const API = {
  logIn,
  logOut,
  getUserInfo,
  postNewServiceType,
  getServicesTypes,
  callNextTicket,
};
export default API;
