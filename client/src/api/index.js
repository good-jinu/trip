import axios from 'axios'

async function fetchPlaceList() {
  return axios.get(`/place.json`);
}

function fetchPlace(name) {
  return axios.get(`/${name}.json`);
}

export {
  fetchPlaceList,
  fetchPlace,
};