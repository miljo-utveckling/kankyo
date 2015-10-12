angular.module('starter').controller('ChallengesCtrl', 
    ['$scope', '$ionicModal', 'ChallengesService', 'RoutesService', 
    function($scope, $ionicModal, ChallengesService, RoutesService) {

    ChallengesService.getAllActivities().success(function(data){
        console.log('ChallengeService success: ', data);
        ChallengesService.updateChallenges(data.challenges);
    }).error(function(error){
        console.log('error', error);
    });

    console.log('Challenges updated... ' + ChallengesService.challenges.length);

    
  
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

    $scope.challenges = ChallengesService.challenges;

    $ionicModal.fromTemplateUrl('templates/newChallengeModal.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.challengeModal = modal;
    });

    $scope.newChallenge = function(){
        $scope.challengeModal.show();
    };

    $scope.closeNewChallenge = function(){
        $scope.challengeModal.hide();
    };

    $scope.saveChallenge = function(type, goal){
        console.log('save challenge--- ' + type);
        ChallengesService.saveChallenge(new Challenge(type, $scope.c02, $scope.dist, goal, $scope.destination));
        $scope.challengeModal.hide();
    }

}]);
