angular.module('starter').factory('RoutesService', ['$http', function($http) {
	var traffikLabApi = 'http://api.commutegreener.com/api/co2/emissions?';
	var RoutesService = {
		userLocations: {
			savedMarkers: []
		},
		savedRoutes: [],

		// getUserLocations : function(){
		// 	return userLocations;
		// },
		getNumOfMarkers: function(){
			return RoutesService.userLocations.savedMarkers.length;
		},
		resetSavedMarkers: function(){
			RoutesService.userLocations.savedMarkers.length = 0;
		},
		addUserLocation : function(name, lat, lng){
			var msg = 'Punkt: ' + name;
			RoutesService.userLocations.savedMarkers.push({
				lat: lat,
	            lng: lng,
	            message: msg,
	            //focus: true,
	            draggable: true
			});
		},
		calcCo2FromDistance : function(){
			return $http.get(traffikLabApi + 'startLat=' + RoutesService.userLocations.savedMarkers[0].lat 
											+ '&startLng=' + RoutesService.userLocations.savedMarkers[0].lng
											+ '&endLat=' + RoutesService.userLocations.savedMarkers[1].lat
											+ '&endLng=' + RoutesService.userLocations.savedMarkers[1].lng
											+ '&format=json');
		},
		getRoutes: function(){
			return RoutesService.savedRoutes;
		},
		testServiceCall: function(){
			console.log('testing routesService')
		},
		saveRoutes: function(str, dist, em){
			console.log(str +' ' + dist);
			var tmpMarkers = [];
			RoutesService.userLocations.savedMarkers.forEach(function(smark){
				console.log('marker meddage: ' + smark.message);
				tmpMarkers.push({
					lat: smark.lat,
					lng: smark.lng,
					message: smark.message
				});
			});
			// now, when all markers are fetched, save the route
			RoutesService.savedRoutes.push({
				name: str,
				distance: dist,
				emissions: em,
				markers: tmpMarkers
			});
		},
		persistRoutes: function(data){
		    	return $http.post(url + '/route/johan', data);
	};

  	return RoutesService;

}]);
