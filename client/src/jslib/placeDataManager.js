import axios from 'axios';
import { getCookie } from './cookieIO';

const headerAuth = ()=>{
	return {
		headers: {
			'Authorization': 'Bearer '+getCookie('accessToken')
		}
	};
}

async function getPlaceCount() {
	return axios.get('/place/count')
	.then((res)=>{
		return(res.data.cnt);
	})
	.catch((err)=>{
		console.error(err);
		throw(err);
	});
}

async function getPlaceList(page=1){
	return axios.get('/place/list?page='+page.toString())
	.then((res)=>{
		return(res.data);
	})
	.catch((err)=>{
		console.error(err);
		throw(err);
	});
}

async function getPlaceInfo(pName) {
	return axios.get('/place/info/'+pName)
	.then((res)=>{
		return([...res.data]);
	})
	.catch((err)=>{
		console.error(err);
		throw(err);
	});
}

async function postPlace(frm) {
	return axios.post('/place',frm, headerAuth())
	.then(()=>{
		console.log('place info uploaded');
		return;
	})
	.catch((err)=>{
		console.error(err);
		throw(err);
	});
}

async function patchPlace(placeId, frm) {
	return axios.patch('/place/'+placeId, frm,headerAuth())
	.then(()=>{
		console.log('place info uploaded');
		return;
	})
	.catch((err)=>{
		console.error(err);
		throw(err);
	});
}

async function getAttractionList(placeId, page=1) {
	return axios.get('/attraction/list/'+placeId+'?page='+page.toString())
	.then((res)=>{
		return(res.data);
	})
	.catch((err)=>{
		console.error(err);
		throw(err);
	});
}

async function getAttractionInfo(attId) {
	return axios.get('/attraction/info/'+attId)
	.then((res)=>{
		return(res.data);
	})
	.catch((err)=>{
		console.error(err);
		throw(err);
	});
}

async function postAttraction(placeId, frm) {
	return axios.post('/attraction/'+placeId, frm, headerAuth())
	.then(()=>{
		console.log('attraction uploaded');
		return;
	})
	.catch((err)=>{
		console.error(err);
		throw(err);
	});
}

async function patchAttraction(attId, frm) {
	return axios.patch('/attraction/'+attId,frm,headerAuth())
	.then(()=> {
		console.log('attraction uploaded');
		return;
	})
	.catch((err)=>{
		console.error(err);
		throw(err);
	});
}

async function deletePlace(placeId) {
	return axios.delete('/place/'+placeId,headerAuth())
	.then(()=> {
		console.log('place deleted');
		return;
	})
	.catch((err)=>{
		console.error(err);
		throw(err);
	});
}

async function deleteAttraction(attId) {
	return axios.delete('/attraction/'+attId,headerAuth())
	.then(()=>{
		console.log('attraction deleted');
		return;
	})
	.catch((err)=>{
		console.error(err);
		throw(err);
	});
}

export {getPlaceCount, getPlaceList, getPlaceInfo, postPlace, patchPlace, deletePlace, getAttractionList, getAttractionInfo, postAttraction, patchAttraction, deleteAttraction};
