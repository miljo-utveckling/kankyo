angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('DashboardCtrl', function($scope, $ionicModal, $ionicLoading, User, ChallengesService, RoutesService){
    console.log('Dash controller...');

    $ionicLoading.show({
      template: 'Loading...'
    });

  User.getAllActivities()
    .success(function(activities){
        $ionicLoading.hide();
        $scope.activityList = activities;
    })
    .error(function(error){
        $ionicLoading.hide();
        console.log(error);
    });

  $scope.users = [];

  $ionicModal.fromTemplateUrl('templates/activityModal.html', {
      scope: $scope
  }).then(function(modal) {
      $scope.activityModal = modal;
  });

    $scope.closeActivityModal = function() {
      $scope.activityModal.hide();
    };

    $scope.openActivityModal = function(activity) {
      $scope.activity = activity;
      $scope.activityTitle = activity.title;
      $scope.activityId = activity.id;
      $scope.activityCategory = activity.category;
      $scope.activityAmount = activity.amount;
      $scope.activityGoal = activity.goal;
      $scope.activityPeriod = 7; //activity.period;
      $scope.activityTimeUnit = 'vecka'; //activity.timeUnit;
      $scope.activityModal.show();
    };

    $scope.registerAction = function(activity){
      User.registerUserAction(activity)
        .success(function(retVal){
          //alert('success in update');
          $scope.activityAmount = $scope.activityAmount + 1; //TODO: this must be cghanged
        })
        .error(function(error){
          console.log('Register action failed.');
        });
    };

    $ionicModal.fromTemplateUrl('templates/newChallengeModal.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.challengeModal = modal;
    });

    $scope.routes = RoutesService.savedRoutes;
    $scope.c02 = 0;
    $scope.dist = 0;
    $scope.destination = '';
    $scope.setResults = function(item) {
        console.log('sth212121 ', item);
        $scope.c02 = item.emissions;
        $scope.dist = item.distance;
        $scope.destination = item.name;
    };

    // the Challenge object def
    var Challenge = function(type, c02, dist, goal, destination) {
        //if ( !(this instanceof Challenge) ) return new Challenge();
        this.id = 999;         // should be set by DB as sequence?
        this.amount  = 0;
        this.c02 = c02;        // calculated via map OR pre-set value
        this.dist = dist;      // calculated via map OR pre-set value
        this.category = type;  // one of 'Gå', 'Buss', 'Cykla'...
        this.goal = goal;      // one of '1 gång /vecka', '2 gågner / vecka' ...
        this.destinaton = destination;
        this.title =  type + ' sträckan ' + destination;
    };

    $scope.newChallenge = function(){
        $scope.challengeModal.show();
    };

    $scope.closeNewChallenge = function(){
        $scope.challengeModal.hide();
    };

    $scope.saveChallenge = function(type, goal){
        ChallengesService.saveChallenge(new Challenge(type, $scope.c02, $scope.dist, goal, $scope.destination));
        $scope.challengeModal.hide();
    }
})

.controller('MapCtrl', function($scope, leafletData, $cordovaGeolocation, $ionicLoading, $ionicPopup, 
                                $ionicModal, InstructionsService, LocationsService){  //RoutesService
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

                LocationsService.addUserLocation('Start', position.coords.latitude, position.coords.longitude);

                $scope.loading.hide();
            }, function(error){
                console.log('error', error);
            });

    };

    $scope.calcCo2FromDistance = function(){
        console.log('no of markers: ' + LocationsService.getNumOfMarkers());
        if(LocationsService.getNumOfMarkers() > 1){
            LocationsService.calcCo2FromDistance()
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

    $scope.savePath = function(name, distance, emissions){
        console.log(LocationsService.getNumOfMarkers());
        LocationsService.saveRoutes(name, distance, emissions);
        LocationsService.resetSavedMarkers();
        $scope.pathModal.hide();
    };

    $scope.loadRoutes = function(){
        var routes = LocationsService.getRoutes();
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

        LocationsService.addUserLocation(counter, locationEvent.leafletEvent.latlng.lat, locationEvent.leafletEvent.latlng.lng);
        counter++;
        console.log('counter: ' +  counter);
    });

    $scope.allMarkers = LocationsService.getUserLocations();

    angular.extend($scope, {
        osloCenter: {
            lat: 59.33472,
            lng: 18.0951,
            zoom: 8
        },
        // markers: {
        //     osloMarker: LocationsService.getUserLocations()
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

})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
    console.log('stateParams: ' , $stateParams);
});
