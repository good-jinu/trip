<template>
	<div class="edit">
		<table>
			<thead>
				<tr>
					<th>Name</th>
					<th>attractions</th>
					<th>remove</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="item in items" :key="item.place_id">
					<td>{{item.name}}</td>
					<td><button @click="handleAttBoard(item.name, item.place_id)">detail</button></td>
					<td><button @click="removeP(item.place_id)">remove</button></td>
				</tr>
				<tr>
					<td><button @click="handleAddPlace">Add</button></td>
				</tr>
			</tbody>
		</table>

		<div class="uploadModal" v-if="attBoardScreen">
			<div>
				<button @click="quitAttBoard">X</button>
				<div class="attBoard_title">{{mosc_pName}}</div>
				<table>
					<tr>
						<td>Name</td>
						<td>patch</td>
						<td>remove</td>
					</tr>
					<tr v-for="atitem in atitems" :key="atitem.attraction_id">
						<td>{{atitem.name}}</td>
						<td><button @click="handleAddAttraction(atitem.attraction_id, true)">patch</button></td>
						<td><button @click="removeA(atitem.attraction_id)">remove</button></td>
					</tr>
					<tr>
						<td><button @click="handleAddAttraction">Add</button></td>
					</tr>
				</table>
			</div>
		</div>

		<div class="uploadModal" v-if="modalScreen">
			<div>
				<button @click="quitAddScreen">X</button>
				<Up_place v-if="up_pl"/>
				<Up_attraction v-else :pName="mosc_pName" :pID="mosc_pID" :aID="mosc_aID" :isPatch="mosc_isPatch"/>
			</div>
		</div>
	</div>
</template>

<script>
import Up_place from './Up_place.vue';
import Up_attraction from './Up_attraction.vue';
import { getPlaceList, getAttractionList, deletePlace, deleteAttraction } from '@/jslib/placeDataManager';

export default {
	components: {
		Up_place,
		Up_attraction
	},

	data() {
		return {
			items: [],
			up_pl: true,
			modalScreen: false,
			mosc_pName: "",
			mosc_pID: "",
			mosc_aID: "",
			mosc_isPatch: false,
			atitems: [],
			attBoardScreen: false
		}
	},
	beforeMount() {
		getPlaceList(1)
		.then((res)=>{
			this.items=res;
		});
	},
	methods: {
		handleAddPlace: function () {
			this.modalScreen = true;
			this.up_pl = true;
		},

		handleAttBoard: function(pname, pid) {
			this.attBoardScreen=true;
			this.mosc_pName=pname;
			this.mosc_pID=pid;
			getAttractionList(pid, 1)
			.then((res)=>{
				this.atitems=res;
			});
		},

		handleAddAttraction: function(attid="", ispatch=false) {
			this.up_pl=false;
			this.mosc_aID=attid;
			this.mosc_isPatch=ispatch;
			this.modalScreen=true;
		},
		
		quitAddScreen: function() {
			this.modalScreen = false;
			getPlaceList(1)
			.then((res)=>{
				this.items=res;
			});
			getAttractionList(this.mosc_pID, 1)
			.then((res)=> {
				this.atitems=res;
			});
		},

		quitAttBoard: function() {
			this.attBoardScreen=false;
		},

		removeP: function(pid) {
			deletePlace(pid)
			.then(()=>{
				window.alert('Place removed');
				getPlaceList(1)
				.then((res)=>{
					this.items=res;
				});
			});
		},

		removeA: function(aid) {
			deleteAttraction(aid)
			.then(()=>{
				window.alert('Attraction removed');
				getAttractionList(this.mosc_pID, 1)
				.then((res)=>{
					this.atitems=res;
				});
			});
		}
	}
};
</script>

<style>
.uploadModal {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

.uploadModal > div {
	background-color: #b5b5b5;
}
.edit table {
	width: 100%;
	border: 1px solid #222222;
}
</style>
