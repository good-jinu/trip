<template>
	<div class="uploading uploading_place">
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
	</div>
</template>

<script>
import { getPlaceInfo, postPlace, patchPlace } from '@/jslib/placeDataManager';

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
				getPlaceInfo(event.target.name.value)
				.then((res)=> {
					if(res.length>0) {
						patchPlace(res[0].place_id.toString(),frm)
						.then(()=> {
							window.alert('Uploaded!');
						})
						.catch(()=> {
							window.alert('Upload failed!');
						});
					} else {
						postPlace(frm)
						.then(()=> {
							window.alert("Uploaded!");
						})
						.catch(()=> {
							window.alert('Upload failed!');
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
