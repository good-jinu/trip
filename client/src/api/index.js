import axios from 'axios'

async function fetchPlace() {
  return axios.get(`/place/list?page=`);
}

function fetchAttraction(placeId) {
  return axios.get(`/attraction/list/${placeId}?page=`);
}

export { fetchPlace, fetchAttraction };