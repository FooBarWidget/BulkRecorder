var app = angular.module('app', []);

function AppCtrl($scope, $window) {
	$scope.lists = $window.wordLists;
	$scope.activeTab = 'practice';
	$scope.words = [];
	$scope.disableDictationButton = true;

	function indexAllWords() {
		angular.forEach($scope.lists, function(list) {
			angular.forEach(list.words, function(word) {
				word.list = list;
			});
		});
	}

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
		$scope.dictationSession = new DictationSession($scope.words);
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

	indexAllWords();
	$scope.selectAll(true);
}

function DictationSession(words) {
	function shuffle(o) {
		for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
		return o;
	}

	this.words = shuffle(words);
	this.index = 0;
	if (this.words.length == 0) {
		this.dicatedWords = [];
	} else {
		this.dictatedWords = [this.words[0]];
	}
	this._showCurrentWord = false;
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
		this._showCurrentWord = false;
		return true;
	}
}

DictationSession.prototype.showCurrentWord = function(val) {
	if (arguments.length > 0) {
		this._showCurrentWord = val;
	} else {
		return this._showCurrentWord;
	}
}

DictationSession.prototype.total = function() {
	return this.words.length;
}

DictationSession.prototype.end = function() {
	this.index = this.words.length;
}

DictationSession.prototype.ended = function() {
	return this.index == this.words.length;
}
