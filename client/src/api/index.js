import axios from 'axios'

async function fetchCity() {
  return axios.get(`/place.json`);
}

function fetchPlace(name) {
  return axios.get(`/${name}.json`);
}

export { fetchCity, fetchPlace };