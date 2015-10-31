angular.module('starter').factory('ChallengesService', ['$http', function($http) {
	var url = 'https://aqueous-caverns-6086.herokuapp.com';
	var ChallengesService = {
		challenges: [
			// {
			// 	'title' : 'Köpt begagnade kläder',
			// 	'category' : 'kläder',
			// 	'amount' : 1
			// }
		],
		getAllUsers : function(){
			//return $http.get(url + '/user/getallusers');
			return $http.get(url + '/user/all');
		},
		getAllActivities : function(){
			//return $http.get(url + '/user/getactivities?id=johan');
			return $http.get(url + '/user/johan');
		},
		updateChallenges: function(chList){
			chList.forEach(function(item){
				ChallengesService.challenges.push(item);
			});
		},
		saveChallenge: function(chlng){
			// return $http.get(...saveChallenge...), but we have no backend for this yet...			
			ChallengesService.challenges.push(chlng);
		}
	};

  	return ChallengesService;

}]);
