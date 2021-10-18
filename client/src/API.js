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
  postNewServiceType,
  getServicesTypes,
  callNextTicket,
};
export default API;
