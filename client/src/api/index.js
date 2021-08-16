import axios from 'axios'

async function fetchPlaceList() {
  try {
    const response = axios.get(`http://localhost:8080/place.json`);
    return response;
  } catch (error) {
    console.log(error);
  }
}

function fetchPlace(name) {
  return axios.get(`/${name}.json`);
}

export default {
  fetchPlaceList,
  fetchPlace,
};