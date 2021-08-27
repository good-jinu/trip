<template>
	<div class="uploading uploading_attraction">
		<div class="placeName">{{pName}}</div>
		<form @submit.prevent="handleUpload">
			<div class="inputBox">
				<label for="name">Enter attraction name: </label>
				<input type="text" name="name"/>
			</div>
			<div class="inputBox">
				<label for="description">Enter attraction description: </label>
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
	</div>
</template>

<script>
import { postAttraction, patchAttraction } from '@/jslib/placeDataManager';

export default {
	props: {
		pName: String,
		pID: String,
		aID: String,
		isPatch: Boolean
	},

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
				if(this.isPatch) {
					patchAttraction(this.aID, frm)
					.then(()=>{
						window.alert('Upload succeded');
					})
					.catch(()=>{
						window.alert('Upload failed!');
					});
				} else {
					postAttraction(this.pID, frm)
					.then(()=>{
						window.alert('Upload succeded');
					})
					.catch(()=>{
						window.alert('Upload failed!');
					});
				}
			} else {
				window.alert('Enter place name');
			}
		}
	}
}
</script>
