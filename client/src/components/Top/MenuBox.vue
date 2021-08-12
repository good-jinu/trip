<template>
	<div class="menubox" v-if="this.$store.getters.getUserInfo.isLogin">
		<button>Log out</button>
	</div>
	<div class="menubox" v-else>
		<button @click="turnOnModal=true">Log in</button>
		<div class="modal-container" v-show="turnOnModal">
			<div class="modal-window" v-if="LoginToSignup">
				<button @click="turnOnModal=false">X</button>
				<form>
					<input type="text" name="id" placeholder="ID"/>
					<input type="password" name="pw" placeholder="Password"/>
					<input type="password" name="repw" placeholder="Password again"/>
					<input type="text" name="username" placeholder="name"/>
					<input type="submit" value="Sign up"/>
				</form>
			</div>
			<div class="modal-window" v-else>
				<button @click="turnOnModal=false">X</button>
				<form>
					<input type="text" name="id" placeholder="ID"/>
					<input type="password" name="pw" placeholder="Password"/>
					<input type="submit" value="Log in"/>
				</form>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			turnOnModal: false,
			LoginToSignup: false
		};
	},
	created() {
		console.log(this);
	},

	methods: {
		handleSignup: function (event) {
			event.preventDefault();
			if(event.target.id.value.length<4 || event.target.pw.value.length<4) {
				window.alert('id and password length should be more than 4');
			} else if(event.target.pw.value !== event.target.repw.value) {
				window.alert('Password is not corresponding with repeated one');
			} else {
				this.$axios.post('/signup_process',
				{
					id: event.target.id.value,
					password: event.target.pw.value,
					name: event.target.username.value
				})
				.then((res) => {
					if(res.status === 201) {
						window.alert('Success!');
						this.LoginToSignup=false;
					} else {
						window.alert('ID or name is already existed');
					}
				})
				.catch((err) => {
					window.alert('Sign up failed!');
					console.error(err);
				});
			}
		},
		handleLogin: function (event) {
			event.preventDefault();
			if(event.target.id.value.length<4 || event.target.pw.value.length<4) {
				window.alert('id and password length should be more than 4');
			} else {
				this.$axios.post('login_process',
				{
					id: event.target.id.value,
					password: event.target.pw.value
				})
				.then((res) => {
					if(res.status === 200) {
						this.$store.dispatch('setUser', {
							user: {
								isLogin: true,
								isAdmin: false,
								name: res.data.name
							}
						});
						window.alert('welcom, '+res.data.name);
					} else {
						window.alert('Wrong id or password!');
					}
				})
				.catch((err) => {
					window.alert('Login failed!');
					console.error(err);
				});
			}
		},
		handleLogout: function () {
			this.$store.dispatch('setUser', {
				user: {
					isLogin: false,
					isAdmin: false,
					name: ''
				}
			});
		}
	}
};
</script>
