angular.module('starter').controller('MapsCtrl', 
	[ '$scope', 'leafletData', '$cordovaGeolocation', '$ionicLoading', '$ionicPopup', '$ionicModal', 'InstructionsService', 'RoutesService',
	function($scope, leafletData, $cordovaGeolocation, $ionicLoading, $ionicPopup, 
                                $ionicModal, InstructionsService, RoutesService) {

    console.log('MapsCtrl initiated...');




    console.log('Map controller...');
    var counter = 1;
    $scope.newLocation;
    $scope.newEmission;
    $scope.newDistance;
    var mapObj;
    var loadedMarkers = new L.FeatureGroup();

    if(!InstructionsService.instructions.newLocations.seen){
        var instructionsPopup = $ionicPopup.alert({
            title: 'Add Locations',
            template: InstructionsService.instructions.newLocations.text
        });
        instructionsPopup.then(function(res) {
            InstructionsService.instructions.newLocations.seen = true;
        });
    }

    var Location = function() {
        if ( !(this instanceof Location) ) return new Location();
        this.lat  = "";
        this.lng  = "";
        this.name = "";
    };

    $ionicModal.fromTemplateUrl('templates/addPath.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.pathModal = modal;
    });

    // everytime we enter menu-item Map, we must call 'invalidateSize()'' to avoid grey map tiles...
    $scope.$on('$ionicView.afterEnter', function(){
        leafletData.getMap().then(function(map) {
            console.log('getMap... when enter');
            mapObj = map;
            mapObj.invalidateSize();
        });

    });

    // try to locate
    $scope.locate = function(){

        $scope.loading = $ionicLoading.show({
            content: 'Getting current location...',
            showBackdrop: false
        });

        $cordovaGeolocation
            .getCurrentPosition()
            .then(function(position){
                console.log('locate!', position);
                $scope.osloCenter.lat = position.coords.latitude;
                $scope.osloCenter.lng = position.coords.longitude;
                $scope.osloCenter.zoom = 15;

                $scope.markers.now = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    message: "Du är här - startpunkt.",
                    focus: true,
                    draggable: true
                };

                RoutesService.addUserLocation('Start', position.coords.latitude, position.coords.longitude);

                $scope.loading.hide();
            }, function(error){
                console.log('error', error);
            });

    };

    $scope.calcCo2FromDistance = function(){
        console.log('no of markers: ' + RoutesService.getNumOfMarkers());
        if(RoutesService.getNumOfMarkers() > 1){
            RoutesService.calcCo2FromDistance()
              .success(function(data){
                  $scope.newEmission = data.emissions[8].totalCo2;
                  $scope.newDistance = data.emissions[8].routedDistance;
                  // $ionicPopup.alert({
                  //     title: 'Resultat',
                  //     template: 'Utsläpp C02 för denna sträcka (stor bil): ' + data.emissions[8].totalCo2 + 
                  //       ' sträcka: ' + data.emissions[8].routedDistance + ' meter'
                  // });
                  $scope.pathModal.show();
              })
              .error(function(error){
                  console.log('error destant API: ' + error);
              });
        } else {
            alert('Det måste finnas minst två punkter för att beräkna sträckan. Lägg till genom att trycka någre sekunder på skärmen');
        }
    };

    $scope.savePath = function(name){
        console.log(RoutesService.getNumOfMarkers());
        RoutesService.saveRoutes(name, $scope.newDistance, $scope.newEmission);

        RoutesService.persistRoutes({test:1})
	    .success(function(route){
	        console.log('persistRoutes, success: ', route);
	    })
	    .error(function(error){
	        console.log(error);
	    });

        RoutesService.resetSavedMarkers();
        $scope.pathModal.hide();
    };

    $scope.loadRoutes = function(){
        var routes = RoutesService.getRoutes();
        if(routes.length === 0){
            alert('Inga rutter sparade än.');
        } else{  
            var lastLat, lastLng;   
            var latlngs = []; 
            routes.forEach(function(route){
                route.markers.forEach(function(mark){
                    lastLat = mark.lat;
                    lastLng = mark.lng;
                    latlngs.push(new L.LatLng(lastLat, lastLng));
                    var mrk = L.marker(new L.LatLng(mark.lat, mark.lng));
                    mrk.bindPopup(mark.message);
                    loadedMarkers.addLayer(mrk);
                });
                // also, draw lines between the markers..
                var polyLine = new L.Polyline(latlngs, {color: 'red'});
                loadedMarkers.addLayer(polyLine);
                latlngs.length = 0;
            });
            

            mapObj.addLayer(loadedMarkers);
            mapObj.setView([lastLat, lastLng], 10);
        }
    };

    $scope.clearRoutes = function(){
        mapObj.removeLayer(loadedMarkers);
    };

    /**
     * Detect user long-pressing on map to add new location
     */
    $scope.$on('leafletDirectiveMap.contextmenu', function(event, locationEvent){
        $scope.newLocation = new Location();
        $scope.newLocation.lat = locationEvent.leafletEvent.latlng.lat;
        $scope.newLocation.lng = locationEvent.leafletEvent.latlng.lng;
        //$scope.modal.show();
        console.log('long press', $scope.newLocation);

        RoutesService.addUserLocation(counter, locationEvent.leafletEvent.latlng.lat, locationEvent.leafletEvent.latlng.lng);
        counter++;
        console.log('counter: ' +  counter);
    });

    //$scope.allMarkers = RoutesService.getUserLocations();
    $scope.allMarkers = RoutesService.userLocations;

    angular.extend($scope, {
        osloCenter: {
            lat: 59.33472,
            lng: 18.0951,
            zoom: 8
        },
        // markers: {
        //     osloMarker: RoutesService.getUserLocations()
        // },
        markers: $scope.allMarkers.savedMarkers,
        defaults: {
            scrollWheelZoom: false
        },
        layers: {
          baselayers: {
            osm: {
                name: 'OpenStreetMap',
                url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                type: 'xyz'
            }
          }
        }
    });


    

}]);
