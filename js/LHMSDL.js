var Services = angular.module('LHMSDL.services', []);
var Controllers = angular.module('LHMSDL.controllers', []);
var Resources = angular.module('LHMSDL.resources', []);
var Directives = angular.module('LHMSDL.directives',[]);
var Facilite = angular.module('LHMSDL', ['LHMSDL.directives','LHMSDL.resources', 'LHMSDL.controllers', 'LHMSDL.services', /*'LHMSDL.filters', */'ngResource']);

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
	nom: Nom�quipe,
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

// LocalStorageResource
function LSR(){}

LSR.prototype = {
	populate : function(){

	},
	cleanup : function(){
        window.localStorage.removeItem('Players');
	},
	addPlayer : function(pl){
        //alert(JSON.stringify(pl));
        var  lst = lsr.getPlayerList();
        lst.push(pl);
        window.localStorage.setItem('Players',JSON.stringify(lst));
	},
	editPlayer : function(pl){
        var lst = lsr.getPlayerList();
        for(var i =0; i<lst.length;i++){
            if(lst[i].id ==  pl.id){
                lst[i] = pl;
                break;
            }
        }
        window.localStorage.setItem('Players',JSON.stringify(lst));
	},

	// Get
	getPlayerList : function(allowAdd){
        var tmpPlayers = window.localStorage.getItem('Players');
        var retValue = [];
        if (tmpPlayers !== null) {
            retValue = JSON.parse(tmpPlayers);
        } else {
            retValue.push({id:0, nom:'Nouveau joueur'})
        }
        return retValue;
	},
	getSinglePlayer : function(id){
	}
};

var lsr = new LSR();

Controllers.controller('AppCtrl', function ($rootScope, $location, $scope) {
    $rootScope.$on('$locationChangeStart', function (event, newLocation) {
    });
    $rootScope.$on('$routeChangeStart', function (next, current) {
    });
});

Controllers.controller('LHMSDLCtrl', function ($rootScope, $scope, $locale, $location, Title) {
    $scope.init = function () {
		$scope.Title = Title;
		//lsr.populate();
    } ();

    $scope.gotoPlayer = function(){
        $location.path('/joueur')
    };
});

Controllers.controller('FormationCtrl', function ($rootScope, $scope, $locale, $location, Title) {
    $scope.init = function () {
		$scope.Title = Title;
    } ();
});

Controllers.controller('JoueurCtrl', function($rootScope, $scope, $locale, $location, Title){
    $scope.init = function (){
        $scope.Title = Title;
        //lsr.cleanup();
    }();
    //$scope.id = 0;
    //$scope.nom = '';
    $scope.editMode = false;
    $scope.playerList = lsr.getPlayerList();

    $scope.savePlayer = function(){
        if ($scope.editMode) {
            lsr.editPlayer($scope.player);
        } else {
            lsr.addPlayer($scope.player);
        }
        $scope.playerList = lsr.getPlayerList();
    };

    $scope.selectPlayer = function(player){
        if(player.id==0){
            $scope.player = {nom:''};
            $scope.editMode = false;
        }
        else{
            $scope.player = player;
            $scope.editMode = true;
        }
    };
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
                return 'écran principale';
            }
        }
    }).when('/formation', {
        templateUrl: 'partials/formation.html',
        controller: 'FormationCtrl',
        resolve: {
            Title: function ($route) {
                return 'écran Formation';
            }
        }
    }).when('/joueur', {
        templateUrl: 'partials/joueur.html',
        controller: 'JoueurCtrl',
        resolve: {
            Title: function ($route) {
                return 'écran Joueur';
            }
        }
    });
});

Directives.directive('PlayerTag',function(){
    var directiveDefinitionObject = {
        restrict:'EA',
        template: '<div></div>',
        compile: function compile(tElement, tAttrs) {
            return function postLink(scope, iElement, iAttrs) {

            }
        }
    };
    return directiveDefinitionObject;
});