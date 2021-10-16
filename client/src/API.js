const url = "http://localhost:3001/";
async function callNextTicket(counterId) {
  const response = await fetch(url + "tickets/serve/" + counterId);

  const ticket = await response.json();

  return ticket;
}

const API = {
  callNextTicket,
};
export default API;
