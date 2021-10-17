const url = "http://localhost:3001/";

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

const API = {
  postNewServiceType,
  getServicesTypes,
};
export default API;
