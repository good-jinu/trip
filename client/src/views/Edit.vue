<template>
	<article class="editor">
		<form @submit.prevent="handleUpload">
			<div class="inputBox">
				<label for="name">Enter place name: </label>
				<input type="text" name="name"/>
			</div>
			<div class="inputBox">
				<label for="description">Enter place description: </label>
				<input type="text" name="description"/>
			</div>
			<div class="inputBox">
				<label for="image">Put image file: </label>
				<input type="file" name="image" accept="image/png, image/jpeg"/>
			</div>
			<div class="inputBox">
				<label for="imageCopyright">Enter image copyright: </label>
				<input type="text" name="imageCopyright"/>
			</div>
			<div class="inputBox">
				<input type="submit"/>
			</div>
		</form>
	</article>
</template>

<script>
import axios from 'axios';
import { getCookie } from '@/jslib/cookieIO';

export default {
	methods: {
		handleUpload: function(event) {
			const frm = new FormData();
			if(event.target.name.value) {
				frm.append('name', event.target.name.value);
				if(event.target.description.value) {
					frm.append('description', event.target.description.value);
				}
				if(event.target.image.files[0]) {
					frm.append('image', event.target.image.files[0]);
					if(event.target.imageCopyright.value) {
						frm.append('imageCopyright', event.target.imageCopyright.value);
					}
				}
				axios.get("/place/info/"+event.target.name.value)
				.then((res)=> {
					if(res.data.length>0) {
						axios.patch("/place/"+res.data[0].place_id.toString(),frm, {
							headers: {
								"Authorization": "Bearer "+getCookie("accessToken")
							}
						})
						.then(()=> {
							window.alert('Uploaded!');
						})
						.catch((err)=> {
							window.alert('Upload failed!');
							console.error(err);
						});
					} else {
						axios.post("/place",frm, {
							headers: {
								"Authorization": "Bearer "+getCookie("accessToken")
							}
						})
						.then(()=> {
							window.alert("Uploaded!");
						})
						.catch((err)=> {
							window.alert('Upload failed!');
							console.error(err);
						});
					}
				})
				.catch((err)=> {
					console.error(err);
					window.alert('Upload failed..');
				});
			} else {
				window.alert('Enter place name');
			}
		}
	}
}
</script>
