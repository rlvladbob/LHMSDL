var Services = angular.module('LHMSDL.services', []);
var Controllers = angular.module('LHMSDL.controllers', []);
var Resources = angular.module('LHMSDL.resources', []);
var Facilite = angular.module('LHMSDL', [/*'LHMSDL.directives',*/'LHMSDL.resources', 'LHMSDL.controllers', 'LHMSDL.services', /*'LHMSDL.filters', */'ngResource']);

//var path = '/Referenceur.svc';
//var path = 'http://localhost\\:9999/Referenceur.svc';
//var path = 'http://srvfic09/Referenceur/Referenceur.svc';

/*
Data definition:
Player = {
	id: NoChandail,
	nom: NomJoueur
}
Team = {
	id: Id,
	nom: Nom…quipe,
	players: [id..]
}
Game = {
	id: id,
	day: yyyyMMdd,
	score: [{
		playerId: id,
		goal: NombreBut,
		assist: NombrePasse,
		teamId: id
	}]
}
*/
/*
// LocalStorageResource
var LSR = {
	var populate = function(){
	};
	var cleanup = function(){
	};
	var addPlayer = function(pl){
	};
	var editPlayer = function(pl){
	};

	// Get
	var getPlayerList = function(){
	};
	var getSinglePlayer = function(id){
	};

};
*/
Controllers.controller('AppCtrl', function ($rootScope, $location, $scope) {
    $rootScope.$on('$locationChangeStart', function (event, newLocation) {
    });
    $rootScope.$on('$routeChangeStart', function (next, current) {
    });
});

Controllers.controller('LHMSDLCtrl', function ($rootScope, $scope, $locale, $location, Title) {
    $scope.init = function () {
		$scope.Title = Title;
    } ();
});

Controllers.controller('FormationCtrl', function ($rootScope, $scope, $locale, $location, Title) {
    $scope.init = function () {
		$scope.Title = Title;
    } ();
});

Services.service('LHMSDLService', function ($q) {

    return {
        getXYZ: function (id) {

        }
    };
});

Facilite.config(function ($locationProvider, $routeProvider, $httpProvider) {
    $routeProvider.when('/', {
        templateUrl: 'partials/main.html',
        controller: 'LHMSDLCtrl',
        resolve: {
            Title: function ($route) {
                return '…cran principale';
            }
        }
    }).when('/formation', {
        templateUrl: 'partials/formation.html',
        controller: 'FormationCtrl',
        resolve: {
            Title: function ($route) {
                return '…cran Formation';
            }
        }
    }).when('/joueur', {
        templateUrl: 'partials/joueur.html',
        controller: 'JoueurCtrl',
        resolve: {
            Title: function ($route) {
                return '…cran Joueur';
            }
        }
    });
});