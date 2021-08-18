import axios from 'axios';
import { setCookie, getCookie, deleteCookie } from './cookieIO';

async function signupProcess(_id, _password, _name) {
	return axios.post('/signup_process',
	{
		id: _id,
		password: _password,
		name: _name
	})
	.then((res) => {
		if(res.status === 201) {
			console.log('signup succeeded');
			return true;
		} else {
			return false;
		}
	})
	.catch((err) => {
		console.error(err);
		return false;
	});
}

async function loginProcess(_id, _password) {
	return axios.post('/login_process',
	{
		id: _id,
		password: _password
	})
	.then((res)=>{
		if(res.status === 200) {
			return setTokenCookie(res.data.refreshToken, res.data.accessToken);
		} else {
			return null;
		}
	})
	.catch((err)=>{
		console.error(err);
		return null;
	});
}

async function refresh_token() {
	var rfTok = getCookie('refreshToken');
	var nouser = {
		isLogin: false,
		isAdmin: false,
		name: ''
	};
	if(rfTok) {
		return axios.post('/refresh',{
			refreshToken: rfTok
		})
		.then((res)=>{
			if(res.status===200) {
				return setTokenCookie(res.data.refreshToken, res.data.accessToken);
			} else {
				logoutProcess();
				return nouser;
			}
		})
		.catch((err)=>{
			logoutProcess();
			console.log(err);
			return nouser;
		});
	} else {
		return nouser;
	}
}

function setTokenCookie(refreshToken, accessToken) {
	var cleanRefTok = refreshToken.split('.')[1].replace(/-/g,'+').replace(/_/g,'/');
	var rfDecoded = JSON.parse(window.atob(cleanRefTok));
	setCookie('refreshToken', refreshToken, new Date(rfDecoded.exp*1000));

	var cleanpayload = accessToken.split('.')[1].replace(/-/g,'+').replace(/_/g,'/');
	var atDecoded = JSON.parse(window.atob(cleanpayload));
	setCookie('accessToken',accessToken,new Date(atDecoded.exp*1000));
	var dataToStore = {
		isLogin: true,
		isAdmin: atDecoded.al>1,
		name: atDecoded.name
	};
	return dataToStore;
}

async function logoutProcess() {
	var rfTok = getCookie('refreshToken');
	axios.post('/logout',
	{
		refreshToken: rfTok
	})
	.catch((err)=>{
		console.error(err);
	});
	deleteCookie('refreshToken');
	deleteCookie('accessToken');
}

export { signupProcess, loginProcess, refresh_token, logoutProcess };

