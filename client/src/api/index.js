import axios from 'axios'

async function fetchPlace() {
  return axios.get(`/place.json`);
}

function fetchAttraction(name) {
  return axios.get(`/${name}.json`);
}

export { fetchPlace, fetchAttraction };