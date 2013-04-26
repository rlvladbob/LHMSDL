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
        for(var t =0;t<teams[0].joueur.length;t++){
            if(teams[0].joueur[t] == pl.id){
                wasInTeam=1;
                break;
            }
        }
        for(var t =0;t<teams[1].joueur.length;t++){
            if(teams[1].joueur[t] == pl.id){
                wasInTeam=2;
                break;
            }
        }
        if(teamId!=0){
            teams[teamId-1].joueur.push(pl.id);
        }
        if(wasInTeam!=0){
            var removeIndex = -1
            for(var i=0;i<teams[wasInTeam-1].joueur.length;i++){
                if(teams[wasInTeam-1].joueur[i]==pl.id){
                    removeIndex = i;
                    break;
                }
            }
            if(removeIndex!=-1){
                teams[wasInTeam-1].joueur.splice(removeIndex, 1);
            }
        }
        lsr.saveTeam(teams);
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

Controllers.controller('LHMSDLCtrl', function ($rootScope, $scope, $locale, $location, Title) {
    $rootScope.$on('$locationChangeStart', function (event, newLocation) {
    });
    $rootScope.$on('$routeChangeStart', function (next, current) {
    });

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

    $scope.deletePlayer = function (){

    };
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
        $scope.Equipe1=[];
        $scope.Equipe2=[];
        $scope.pasEquipe=[];

        totals = lsr.getPlayerList(false);
        teams = lsr.getTeams();

        $scope.splitTeam();
    };
    $scope.init();

    $rootScope.$on('dropEvent', function(evt, dragged, dropped) {
        var dropOnTeam = dropped[0].attributes.dropon.nodeValue;

         lsr.switchTeam(dragged, dropOnTeam);

        $scope.init();

        $scope.$apply();
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

