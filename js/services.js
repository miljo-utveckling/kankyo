angular.module('starter.services', [])
.factory('User', function($http){
	var url = 'https://aqueous-caverns-6086.herokuapp.com';
	return {
		getAllUsers : function(){
			return $http.get(url + '/user/getallusers');
		},
		getAllActivities : function(){

			return $http.get(url + '/challenge/johan');

			// return [
			// 	{
			// 		'title' : 'Äta vegetariskt',
			// 		'category' : 'mat',
			// 		'amount' : 3
			// 	},
			// 	{
			// 		'title' : 'Cyklat till jobbet',
			// 		'category' : 'transport',
			// 		'amount' : 2
			// 	},
			// 	{
			// 		'title' : 'Åkt tåg till jobbet',
			// 		'category' : 'transport',
			// 		'amount' : 2
			// 	},
			// 	{
			// 		'title' : 'Köpt begagnade kläder',
			// 		'category' : 'kläder',
			// 		'amount' : 1
			// 	}
			// ];
		},
		registerUserAction : function(activity){
			console.log('in service: registerUserAction');
			return $http.get(url + '/user/check?user=johan&cid=' + activity.id);
		}
	}
})
// .factory('LocationsService', function($http){
// 	// var traffikLabApi = 'http://api.commutegreener.com/api/co2/emissions?startLat=57.7097704&startLng=11.9661608&endLat=57.6969943&endLng=11.9865&format=json';
// 	var traffikLabApi = 'http://api.commutegreener.com/api/co2/emissions?';
// 	var userLocations = {};
// 	var savedRoutes = [];


// 	userLocations.savedMarkers = [
// 		// {
//   //           lat: 59.33472,
//   //           lng: 18.0951,
//   //           message: "I want to travel there!",
//   //           focus: true,
//   //           draggable: true
//   //       }
// 	];

// 	// var route = {
// 	// 	name: 'TestRoute',
// 	// 	distance: 1234,
// 	// 	emissions: 555,
// 	// 	markers: [
// 	// 		{
// 	//             lat: 58.0840996,
// 	//             lng: 15.739427599999999,
// 	//             message: "Start test",
// 	//             focus: true,
// 	//             draggable: true
// 	//         },{
// 	//             lat: 58.033472,
// 	//             lng: 15.60951,
// 	//             message: "End test",
// 	//             focus: true,
// 	//             draggable: true
// 	//         }
// 	// 	]
// 	// };

// 	// var savedRoutes = [];
// 	// savedRoutes.push(route);
	
// 	return {
// 		getUserLocations : function(){
// 			return userLocations;
// 		},
// 		getNumOfMarkers: function(){
// 			return userLocations.savedMarkers.length;
// 		},
// 		resetSavedMarkers: function(){
// 			userLocations.savedMarkers.length = 0;
// 		},
// 		addUserLocation : function(name, lat, lng){
// 			var msg = 'Punkt: ' + name;
// 			userLocations.savedMarkers.push({
// 				lat: lat,
// 	            lng: lng,
// 	            message: msg,
// 	            //focus: true,
// 	            draggable: true
// 			});
// 		},
// 		calcCo2FromDistance : function(){
// 			return $http.get(traffikLabApi + 'startLat=' + userLocations.savedMarkers[0].lat 
// 											+ '&startLng=' + userLocations.savedMarkers[0].lng
// 											+ '&endLat=' + userLocations.savedMarkers[1].lat
// 											+ '&endLng=' + userLocations.savedMarkers[1].lng
// 											+ '&format=json');
// 		},
// 		getRoutes: function(){
// 			return savedRoutes;
// 		},
// 		saveRoutes: function(str, dist, em){
// 			console.log(str +' ' + dist);
// 			var tmpMarkers = [];
// 			userLocations.savedMarkers.forEach(function(smark){
// 				console.log('marker meddage: ' + smark.message);
// 				tmpMarkers.push({
// 					lat: smark.lat,
// 					lng: smark.lng,
// 					message: smark.message
// 				});
// 			});
// 			// now, when all markers are fetched, save the route
// 			savedRoutes.push({
// 				name: str,
// 				distance: dist,
// 				emissions: em,
// 				markers: tmpMarkers
// 			});
// 		}
// 	}
// })
.factory('InstructionsService', function(){
	var instructionsObj = {};

    instructionsObj.instructions = {
	    newLocations : {
	    	text : 'To add a new location, tap and hold on the map',
	      	seen : false
	    }
  	};

  	return instructionsObj;

});
