var app = angular.module('app', []);

function AppCtrl($scope, $http) {
	$scope.lists = [
		{
			name: 'Getallen',
			words: [
				{ text: '0 Nul', url: 'nul.m4a' },
				{ text: '1 Een', url: 'een.m4a' },
				{ text: '2 Twee', url: 'twee.m4a' },
				{ text: '3 Drie', url: 'drie.m4a' }
			]
		},
		{
			name: 'Test',
			words: [
				{ text: '4 Vier', url: 'nul.m4a' }
			]
		},
	];
	$scope.activeTab = 'practice';
	$scope.words = [];
	$scope.disableDictationButton = true;

	$scope.selectAll = function(val) {
		for (var i = 0; i < $scope.lists.length; i++) {
			$scope.lists[i].checked = val;
		}
		$scope.listSelectionChanged();
	}

	$scope.listSelectionChanged = function() {
		$scope.gatherWords();
		$scope.stopDictation();
	}

	$scope.gatherWords = function() {
		var words = [];
		var i;

		for (i = 0; i < $scope.lists.length; i++) {
			if ($scope.lists[i].checked) {
				words = words.concat($scope.lists[i].words);
			}
		}
		
		$scope.words = words;
		$scope.disableDictationButton = words.length == 0;
	}

	$scope.playAudio = function(url) {
		if ($scope.currentAudio) {
			$scope.currentAudio.pause();
		}
		$scope.currentAudio = new Audio(url);
		$scope.currentAudio.play();
	}

	$scope.startDictation = function() {
		window.dictationSession = $scope.dictationSession = new DictationSession($scope.words);
		$scope.dictating = true;
	}

	$scope.stopDictation = function() {
		delete $scope.dicationSession;
		$scope.dictating = false;
	}

	$scope.nextDictationWord = function() {
		$scope.dictationSession.next();
	}

	$scope.endDictation = function() {
		$scope.dictationSession.end();
	}

	$scope.selectAll(true);
}

function DictationSession(words) {
	function shuffle(o) {
		for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
		return o;
	}

	this.words = shuffle(words);
	this.index = 0;
	this.dictatedWords = [];
}

DictationSession.prototype.getCurrentWord = function() {
	return this.words[this.index];
}

DictationSession.prototype.next = function() {
	if (this.index == this.words.length - 1) {
		this.index++;
		return false;
	} else {
		this.index++;
		this.dictatedWords.push(this.words[this.index]);
		return true;
	}
}

DictationSession.prototype.total = function() {
	return this.words.length;
}

DictationSession.prototype.end = function() {
	if (!this.ended()) {
		this.next();
		this.index = this.words.length;
	}
}

DictationSession.prototype.ended = function() {
	return this.index == this.words.length;
}
