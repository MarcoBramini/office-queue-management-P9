const url = "http://localhost:3001/";
const BASEURL = '/api';

async function callNextTicket(counterId) {
  const response = await fetch(url + "tickets/serve/" + counterId);

  const ticket = await response.json();

  return ticket;
}

async function postNewServiceType(newService) {
  const response = await fetch(url + "serviceTypes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...newService }),
  });

  if (response.ok) return null;
  else return { err: "post error" };
}

async function getServicesTypes() {
  const response = await fetch(url + "serviceTypes");
  const services = await response.json();

  return services;
}



function getJson(httpResponsePromise) {
  return new Promise((resolve, reject) => {
    httpResponsePromise
      .then((response) => {
        if (response.ok) {

        
         response.json()
            .then( json => resolve(json) )
            .catch( err => reject({ error: "Cannot parse server response" }))

        } else {
          
          response.json()
            .then(obj => reject(obj)) 
            .catch(err => reject({ error: "Cannot parse server response" })) 
        }
      })
      .catch(err => reject({ error: "Cannot communicate"  }))
  });
}

async function addTicket(serviceType) {
  return getJson(
    fetch(BASEURL + "/tickets", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({serviceType: serviceType})
    })
  )
}



const API = {
  addTicket,
  postNewServiceType,
  getServicesTypes,
  callNextTicket,
};
export default API;
