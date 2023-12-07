(function () {
    'use strict';
    angular.module('RedPandasPlayers', [])
	.controller('PlayerController', PlayerController)
	.service('PlayerListService', PlayerListService)
	.constant('ApiBasePath1', "./players.json")
	.directive('playerList', playerListDirective);


	function playerListDirective() {
		var ddo = {
			restrict: "E",
			templateUrl: 'players.html',
			scope: {
				players: '<'
			},
			controller: playerListDirectiveController,
			controllerAs: 'dctrl',
			bindToController: true
		};
		return ddo;
		}

	function playerListDirectiveController() {
		var pdctrl = this;
		pdctrl.isempty = function (){
		if (pdctrl.foundItems.length === 0 && pdctrl.foundItems !== 'undefined'){
			return true;
		}
		return false;
	};
	}

	
	  

	function PlayerController(PlayerListService) {
		var pla = this;
		pla.search = "";
		pla.result = "";
		pla.selecetedPose = [
			{"name": "وسط",
				"c": "M"
			},
			{"name": "دفاع",
				"c": "D"
			},
			{"name": "هجوم",
				"c": "F"
			},
		]
		pla.matchPlayer = [];
		if(pla.players == null){
			var promise = PlayerListService.getPlayerList();
			promise.then(function (response) {
			//console.log("inside promise");
			pla.players = response.data;
			//console.log(pla.players);
			})
			.catch(function (error) {
				console.log("Something went terribly wrong.");
			});
		}
		pla.redTeam = [];
		pla.blueTeam = [];
		pla.blueTeamStrength ;
		pla.redTeamStrength ;
		

		pla.newGanerate = function newGanerate(){
		pla.matchPlayer = shuffle(pla.matchPlayer);
			
		var ForwardPlayer = pla.matchPlayer.filter(o => o.pose=="F");	
		var midfielderPlayer = pla.matchPlayer.filter(o => o.pose=="M");
		
		var mResult = equalTeams(midfielderPlayer);
		var defenderPlayer = pla.matchPlayer.filter(o => o.pose=="D");
		var fResult = equalTeams(ForwardPlayer);
		console.log(ForwardPlayer , "forwardPlayer");
		var dResult = equalTeams(defenderPlayer);
		var teamA = [];
		var teamAStrngeth = 0;
		var teamB = [];
		var teamBStrngeth = 0;
		if(mResult.strengths[0] >= mResult.strengths[1]){
			if(dResult.strengths[0] > dResult.strengths[1]){
				teamA = [...mResult.teams[0] , ...dResult.teams[1], ...fResult.teams[0]];
				teamB = [...mResult.teams[1] , ...dResult.teams[0], ...fResult.teams[1]];
				teamAStrngeth = mResult.strengths[0] + dResult.strengths[1] + fResult.strengths[0];
				teamBStrngeth = mResult.strengths[1] + dResult.strengths[0] + fResult.strengths[1];
			}else{
				teamA = [...mResult.teams[0] , ...dResult.teams[0] , ...fResult.teams[1]];
				teamB = [...mResult.teams[1] , ...dResult.teams[1] , ...fResult.teams[0]];
				teamAStrngeth = mResult.strengths[0] + dResult.strengths[0]  + fResult.strengths[1];
				teamBStrngeth = mResult.strengths[1] + dResult.strengths[1]  + fResult.strengths[0];
			}
		}else{
			if(dResult.strengths[0] < dResult.strengths[1]){
				teamA = [...mResult.teams[0] , ...dResult.teams[1], ...fResult.teams[1]];
				teamB = [...mResult.teams[1] , ...dResult.teams[0], ...fResult.teams[0]];
				teamAStrngeth = mResult.strengths[0] + dResult.strengths[1]  + fResult.strengths[1];
				teamBStrngeth = mResult.strengths[1] + dResult.strengths[0]  + fResult.strengths[0];
			}else{
				teamA = [...mResult.teams[0] , ...dResult.teams[0], ...fResult.teams[0]];
				teamB = [...mResult.teams[1] , ...dResult.teams[1], ...fResult.teams[1]];
				teamAStrngeth = mResult.strengths[0] + dResult.strengths[0] + fResult.strengths[0];
				teamBStrngeth = mResult.strengths[1] + dResult.strengths[1] + fResult.strengths[1];
			}
		}
		console.log("team A" , teamA);
		console.log("team B" , teamB);
		pla.blueTeam = teamA;
		pla.redTeam = teamB;
		pla.blueTeamStrength = teamAStrngeth;
		pla.redTeamStrength = teamBStrngeth;




		if(pla.matchPlayer.length % 2 == 1 || pla.matchPlayer.length > (pla.blueTeam.length + pla.redTeam.length)){
			
			var leftedPlayer = pla.matchPlayer.slice();
			for(var i = 0 ; i < pla.blueTeam.length ; i ++){
				var player1 = pla.blueTeam[i];
				var player2 = pla.redTeam[i];
				var idx = leftedPlayer.indexOf(player1);
				if (idx > -1) {
					leftedPlayer.splice(idx, 1);
				}
				var idx = leftedPlayer.indexOf(player2);
				if (idx > -1) {
					leftedPlayer.splice(idx, 1);
				}
			}
			console.log("lefted players" ,leftedPlayer);
			if(leftedPlayer != null && leftedPlayer.length > 0){
				for(var i = 0 ; i<leftedPlayer.length ; i++){
					var weekerTeam = 1 ;
					if(pla.blueTeamStrength < pla.redTeamStrength){
						weekerTeam = 0;
					}
					if(weekerTeam == 0){
						pla.blueTeam.push(leftedPlayer[i]);
						pla.blueTeamStrength = pla.blueTeamStrength  + (((leftedPlayer[i].strength *3)+ leftedPlayer[i].movement)/2);
					}else{
						pla.redTeam.push(leftedPlayer[i]);
						pla.redTeamStrength = pla.redTeamStrength + (((leftedPlayer[i].strength *3)+ leftedPlayer[i].movement)/2);
					}
				}
				
				
			}
		}
		pla.blueTeam = shuffle(pla.blueTeam);
		pla.redTeam = shuffle(pla.redTeam);
		}
		
		

		pla.toggleSelection = function toggleSelection(player) {
			//console.log("inside selector " , player);
			var idx = pla.matchPlayer.indexOf(player);
			if (idx > -1) {
			  // is currently selected
			  pla.matchPlayer.splice(idx, 1);
			 }
			 else {
			   // is newly selected
			   pla.matchPlayer.push(player);
			 }
		  };
	  pla.changePose = function changePose(player,pose) {
			console.log("inside changePose " , player);
			var idx = pla.players.indexOf(player);
			console.log("player.pose :" , player.pose);
			pla.players[idx].pose = pose;
			console.log("After player.pose :" , pose);
			
		  };
		
		function compareStrength(a, b) { // for sorting players and selections
			return (((a.strength * 3) + a.movement)/2) - (((b.strength *3) + b.movement)/2) ;
		}
		function teamStrength(players) {
			return players.reduce(function(total, player) {return total + (((player.strength *3) + player.movement)/2);}, 0);
		}
		function selectionStrength(players, selection) {
			return players.reduce(function(total, player, index) {return total + (((player.strength *3) + player.movement)/2) * selection[index];}, 0);
		}
		function nextPermutation(selection) { // reverse-lexicographical next permutation of a bit array
			var max = true, pos = selection.length, set = 1;
			while (pos-- && (max || !selection[pos])) if (selection[pos]) ++set; else max = false;
			if (pos < 0) return false;
			selection[pos] = 0;
			while (++pos < selection.length) selection[pos] = set-- > 0 ? 1 : 0;
			return true;
		}
		function swapPlayers(wTeam, sTeam, wSelect, sSelect) {
			for (var i = 0, j = 0; i < wSelect.length; i++) {
				if (wSelect[i]) {
					while (!sSelect[j]) ++j;
					var temp = wTeam[i];
					wTeam[i] = sTeam[j];
					sTeam[j++] = temp;
				}
			}
		}
		function shuffle(array) {
			let currentIndex = array.length,  randomIndex;
		  
			// While there remain elements to shuffle.
			while (currentIndex > 0) {
		  
			  // Pick a remaining element.
			  randomIndex = Math.floor(Math.random() * currentIndex);
			  currentIndex--;
		  
			  // And swap it with the current element.
			  [array[currentIndex], array[randomIndex]] = [
				array[randomIndex], array[currentIndex]];
			}
		  
			return array;
		  }

		function equalTeams(players) {
			// SORT PLAYERS FROM WEAKEST TO STRONGEST
			console.log("before sort" , players);
			players.sort(compareStrength);
			console.log("after sort" , players.sort(compareStrength));
			// INITIAL DISTRIBUTION OF PLAYERS INTO WEAKER AND STRONGER TEAM (ALTERNATING)
			var wTeam = [], sTeam = [];
			for (var i = players.length % 2; i < players.length; i += 2) {
				wTeam.push(players[i]);
				sTeam.push(players[i + 1]);
			}
			/*if(players.length % 2 ==1){
				sTeam.push(players[players.length -1]);
			}*/
			var teamSize = wTeam.length;
			// CALCULATE INITIAL STRENGTH DIFFERENCE
			var initDiff = teamStrength(sTeam) - teamStrength(wTeam);
			var bestDiff = initDiff;
			var wBestSel = [], sBestSel = [];
			// CHECK SELECTIONS OF EVERY SIZE
			for (var selSize = 1; selSize < teamSize && bestDiff > 1; selSize++) {
				var wSelections = [], sSelections = [], selection = [];
				// CREATE INITIAL SELECTION BIT-ARRAY FOR WEAKER TEAM (SKIP PLAYER 1)
				for (var i = 0; i < teamSize; i++)
					selection[i] = (i > 0 && i <= selSize) ? 1 : 0;
				// STORE ALL SELECTIONS FROM WEAKER TEAM AND THEIR STRENGTH
				do wSelections.push({selection: selection.slice(), strength: selectionStrength(wTeam, selection)});
				while (nextPermutation(selection));
				// SORT SELECTIONS FROM WEAKEST TO STRONGEST
				wSelections.sort(compareStrength);
				// CREATE INITIAL SELECTION BIT-ARRAY FOR STRONGER TEAM
				for (var i = 0; i < teamSize; i++)
					selection[i] = (i < selSize) ? 1 : 0;
				// STORE ALL SELECTIONS FROM STRONGER TEAM AND THEIR STRENGTH
				do sSelections.push({selection: selection.slice(), strength: selectionStrength(sTeam, selection)});
				while (nextPermutation(selection));
				// SORT SELECTIONS FROM WEAKEST TO STRONGEST
				sSelections.sort(compareStrength);
				// ITERATE OVER SELECTIONS FROM BOTH TEAMS
				var wPos = 0, sPos = 0;
				while (wPos < wSelections.length && sPos < sSelections.length) {
					// CALCULATE STRENGTH DIFFERENCE IF THESE SELECTIONS WERE SWAPPED
					var wStrength = wSelections[wPos].strength, sStrength = sSelections[sPos].strength;
					var diff = Math.abs(initDiff - 2 * (sStrength - wStrength));
					// SET NEW BEST STRENGTH DIFFERENCE IF SMALLER THAN CURRENT BEST
					if (diff < bestDiff) {
						bestDiff = diff;
						wBestSel = wSelections[wPos].selection.slice();
						sBestSel = sSelections[sPos].selection.slice();
						// STOP SEARCHING IF PERFECT SOLUTION FOUND (DIFFERENCE 0 OR 1)
						if (bestDiff < 2) break;
					}
					// ADVANCE TO NEXT SELECTION FROM WEAKER OR STRONGER TEAM
					if (2 * (sStrength - wStrength) > initDiff) ++wPos; else ++sPos;
				}
			}
			// PERFORM SWAP OF BEST PAIR OF SELECTIONS FROM EACH TEAM
			swapPlayers(wTeam, sTeam, wBestSel, sBestSel);
			return {teams: [wTeam, sTeam], strengths: [teamStrength(wTeam), teamStrength(sTeam)]};
		}
		pla.saveJSON = function saveJSON(){
			var promise = PlayerListService.updatePlayers(pla.players);
			
			promise.then(function (response) {
				//console.log("inside promise");
				pla.players = response.data;
				pla.msg = "Post Data Submitted Successfully!";
				location.reload();
				//console.log(pla.players);
				})
				.catch(function (error) {
					console.log("Something went terribly wrong.");
				});
		}
		
	  }

	  PlayerListService.$inject = ['$http', 'ApiBasePath1'];
	  function PlayerListService($http, ApiBasePath1) {
	  var service = this;
	  service.getPlayerList = function () {
		  var response = $http({
		  method: "GET",
		  url: (ApiBasePath1)
		  });
  
		  return response;
		};
		service.updatePlayers = function(players){
			var h = "ABCDEFG"
			var response = $http({
				method: "GET",
				url: ('./updatePlayers.php/?data='+  players)
				});
				$http({
					method: 'POST',
					url: 'https://aalmalood.github.io/rMatchDay1/updatePlayers.php/',
					data: {
						h: 'players'
						
					}
				}).then(function successCallback(response) {
					console.log(response);
					//getData(response);
				}, function errorCallback(response) {
					console.log('error');
				});
		
				return response;
		  ;
		  /*$http.post('./updatePlayers.php', {data : JSON.stringify(players)}).then(function (response) {

			if (response.data)
			
			console.log("Post Data Submitted Successfully!");
			
			}, function (response) {
			
			console.log("message Service not Exists");
			
			console.log(response.status);
			
			console.log(response.statusText);
			
			console.log( response.headers());
			
			});*/
		};}
    
 })();
