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

	cleanup : function(){
        window.localStorage.removeItem('Players');
	},
    // joueur
	addPlayer : function(pl){
        //alert(JSON.stringify(pl));
        var  lst = lsr.getPlayerList(true);
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
	getPlayerList : function(allowAdd){
       if (typeof allowAdd === 'undefined'){
           alert('Erreur du développeur');
           return;
       }
        var tmpPlayers = window.localStorage.getItem('Players');
        var retValue = [];
        if (tmpPlayers !== null) {
            retValue = JSON.parse(tmpPlayers);
        } else {
            retValue.push({id:0, nom:'Nouveau joueur'})
        }
        if(!allowAdd){
            retValue.splice(0,1);
        }

        return retValue;
	},
    // Équipe
    saveTeam: function(teams){
        window.localStorage.setItem('Team',JSON.stringify(teams));
    },
    switchTeam: function(pl,teamId){
        // autosave
        var teams = lsr.getTeams();
        var wasInTeam = 0;
        var t = _.findWhere(teams[0].joueur,{id : pl.id});
        if(t !== undefined){
            wasInTeam=1;
        }
        t = _.findWhere(teams[1].joueur,{id : pl.id});
        if(t !== undefined){
            wasInTeam=2;
        }
    },
	getTeams: function() {
        //window.localStorage.removeItem('Team');
        var tmpTeam = window.localStorage.getItem('Team');
        if(tmpTeam === null){
            tmpTeam = [{id:1,nom:'Blanc',joueur:[1]},{id:2,nom:'Noir',joueur:[2]}];
            lsr.saveTeam(tmpTeam);
            tmpTeam = "";
            tmpTeam = window.localStorage.getItem('Team');
        }

        return JSON.parse( tmpTeam);
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
    $scope.gotoEquipe = function(){
        $location.path('/equipe')
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
    $scope.playerList = lsr.getPlayerList(true);

    $scope.savePlayer = function(){
        // validation...
        $scope.player.id = parseInt($scope.player.id);
        if ($scope.editMode) {
            lsr.editPlayer($scope.player);
        } else {
            lsr.addPlayer($scope.player);
        }
        $scope.playerList = lsr.getPlayerList(true);
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

Controllers.controller('EquipeCtrl',function($rootScope, $scope, $locale, $location, Title){
    // Bad code if more than 2 team... but doesn't care now, our league as 2 team.
    $scope.Equipe1 = [];
    $scope.Equipe2 = [];
    $scope.pasEquipe=[];

    var totals = null;
    var teams = null;

    $scope.splitTeam = function(){
        /*
        pour chacune des equipes
            trouver joueur
            si existe
                ajouter
                enlever de la liste des joueur
            finsi
        finpour
        affiche la liste des joueur équipe #1 et #2
        affiche la liste sans équipe.
         */
        for(var i=0;i<teams.length;i++){
            var team = teams[i];
            for(var j=0;j<team.joueur.length;j++){
                var jid = team.joueur[j];
                var pl = _.findWhere(totals,{id:jid});
                if(pl != undefined){
                    if(team.id == 1){
                        $scope.Equipe1.push(pl);
                    }else{
                        $scope.Equipe2.push(pl);
                    }
                    pl.Team=team.id;
                }
            }
        }
        $scope.pasEquipe = _.where(totals, {Team: undefined});
    };

    $scope.init = function (){
        $scope.Title = Title;
        totals = lsr.getPlayerList(false);
        teams = lsr.getTeams();

        // fake team
        //teams[0].joueur.push(totals[0]);
        //teams[1].joueur.push(totals[1]);

        $scope.splitTeam();

    }();

    $rootScope.$on('dropEvent', function(evt, dragged, dropped) {
        var dropOnTeam = dropped[0].attributes.dropon.nodeValue;

        lsr.switchTeam(dragged, dropOnTeam);

    });


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
    }).when('/equipe', {
        templateUrl: 'partials/equipe.html',
        controller: 'EquipeCtrl',
        resolve: {
            Title: function ($route) {
                return 'écran Equipe';
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

Directives.directive("drag", ["$rootScope", function($rootScope) {

    function dragStart(evt, element, dragStyle) {
        element.addClass(dragStyle);
        evt.dataTransfer.setData("id", evt.target.id);
        evt.dataTransfer.effectAllowed = 'move';
    };
    function dragEnd(evt, element, dragStyle) {
        element.removeClass(dragStyle);
    };

    return {
        restrict: 'A',
        link: function(scope, element, attrs)  {
            attrs.$set('draggable', 'true');
            scope.dragData = scope[attrs["drag"]];
            scope.dragStyle = attrs["dragstyle"];
            element.bind('dragstart', function(evt) {
                $rootScope.draggedElement = scope.dragData;
                dragStart(evt, element, scope.dragStyle);
            });
            element.bind('dragend', function(evt) {
                dragEnd(evt, element, scope.dragStyle);
            });
        }
    }
}]);

Directives.directive("drop", ['$rootScope', function($rootScope) {

    function dragEnter(evt, element, dropStyle) {
        evt.preventDefault();
        element.addClass(dropStyle);
    };
    function dragLeave(evt, element, dropStyle) {
        element.removeClass(dropStyle);
    };
    function dragOver(evt) {
        evt.preventDefault();
    };
    function drop(evt, element, dropStyle) {
        evt.preventDefault();
        element.removeClass(dropStyle);
    };

    return {
        restrict: 'A',
        link: function(scope, element, attrs)  {
            scope.dropData = scope[attrs["drop"]];
            scope.dropStyle = attrs["dropstyle"];
            element.bind('dragenter', function(evt) {
                dragEnter(evt, element, scope.dropStyle);
            });
            element.bind('dragleave', function(evt) {
                dragLeave(evt, element, scope.dropStyle);
            });
            element.bind('dragover', dragOver);
            element.bind('drop', function(evt) {
                drop(evt, element, scope.dropStyle);
                $rootScope.$broadcast('dropEvent', $rootScope.draggedElement,element/* scope.dropData*/);
            });
        }
    }
}]);