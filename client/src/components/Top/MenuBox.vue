<template>
	<div class="menubox" v-if="this.$store.getters.getUserInfo.isLogin">
		<router-link to="/edit" v-if="this.$store.getters.getUserInfo.isAdmin">
			<button>Edit</button>
		</router-link>
		<span>{{this.$store.getters.getUserInfo.name}}</span>
		<button @click="handleLogout">Log out</button>
	</div>
	<div class="menubox" v-else>
		<button @click="turnOnModal=true">Log in</button>
		<div class="modal-container" v-show="turnOnModal">
			<div class="modal-window" v-if="LoginToSignup">
				<button @click="turnOnModal=false">X</button>
				<form @submit.prevent="handleSignup">
					<input type="text" name="id" placeholder="ID"/>
					<input type="password" name="pw" placeholder="Password"/>
					<input type="password" name="repw" placeholder="Password again"/>
					<input type="text" name="username" placeholder="name"/>
					<input type="submit" value="Sign up"/>
				</form>
				<button @click="LoginToSignup=false">back to login </button>
			</div>
			<div class="modal-window" v-else>
				<button @click="turnOnModal=false">X</button>
				<form @submit.prevent="handleLogin">
					<input type="text" name="id" placeholder="ID"/>
					<input type="password" name="pw" placeholder="Password"/>
					<input type="submit" value="Log in"/>
				</form>
				<button @click="LoginToSignup=true">go to signup</button>
			</div>
		</div>
	</div>
</template>

<script>
import { deleteCookie } from '@/jslib/cookieIO';
import { signupProcess, loginProcess, logoutProcess } from '@/jslib/loginManager';

export default {
	data() {
		return {
			turnOnModal: false,
			LoginToSignup: false
		};
	},

	methods: {
		handleSignup: function (event) {
			event.preventDefault();
			if(event.target.id.value.length<4 || event.target.pw.value.length<4) {
				window.alert('id and password length should be more than 4');
			} else if(event.target.pw.value !== event.target.repw.value) {
				window.alert('Password is not corresponding with repeated one');
			} else {
				signupProcess(event.target.id.value, event.target.pw.value, event.target.username.value)
				.then((val)=> {
					if(val) {
						this.LoginToSignup=false;
						window.alert("Success!");
					} else {
						window.alert("Signup failed!");
					}
				});
			}
		},
		handleLogin: function (event) {
			event.preventDefault();
			if(event.target.id.value.length<4 || event.target.pw.value.length<4) {
				window.alert('id and password length should be more than 4');
			} else {
				loginProcess(event.target.id.value, event.target.pw.value)
				.then((val)=>{
					if(val) {
						this.turnOnModal=false;
						window.alert('Log in succeeded');
						this.$store.dispatch('setUser',val);
					} else {
						window.alert('Log in failed');
					}
				});
			}
		},
		handleLogout: function () {
			this.$store.dispatch('setUser', {
				isLogin: false,
				isAdmin: false,
				name: ''
			});
			logoutProcess();
		}
	}
};
</script>

<style>
.modal-container {
	position: fixed;
	Top: 0;
	left: 0;
	background-color: rgba(0, 0, 0, 0.5);
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

.modal-window {
	position: fixed;
	background-color: white;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

.modal-window > form {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
</style>
