var app = angular.module('app', []);

app.directive('onTouch', function() {
  return {
		restrict: 'A',
		link: function(scope, elm, attrs) {
			if ("ontouchstart" in window) {
				elm.bind('touchend', function(evt) {
					scope.$apply(function() {
						scope.$eval(attrs.onTouch);
					});
				});
				elm.bind('click', function(evt) {
					evt.stopPropagation();
					evt.preventDefault();
				});
			} else {
				elm.bind('click', function(evt) {
					scope.$apply(function() {
						scope.$eval(attrs.onTouch);
					});
				});
			}
		}
	};
});

function AppCtrl($scope, $window) {
	$scope.lists = $window.wordLists;
	$scope.words = [];
	$scope.activeTab = 'practice';
	$scope.selectedLists = [];
	$scope.selectedWords = [];
	$scope.disableDictationButton = true;

	function indexAllWords() {
		angular.forEach($scope.lists, function(list) {
			angular.forEach(list.words, function(word) {
				word.list = list;
				word.oggUrl = word.url.replace(/\.aac$/, '.ogg');
				$scope.words.push(word);
			});
		});
	}

	$scope.selectAllLists = function(val) {
		angular.forEach($scope.lists, function(list) {
			list.selected = val;
		});
		$scope.listSelectionChanged();
	}

	$scope.deselectList = function(list) {
		list.selected = false;
		$scope.listSelectionChanged();
	}

	$scope.listSelectionChanged = function() {
		$scope.stopDictation();

		var lists = [];
		var words = [];
		angular.forEach($scope.lists, function(list) {
			if (list.selected) {
				lists.push(list);
				words = words.concat(list.words);
			}
		});
		
		$scope.selectedLists = lists;
		$scope.selectedWords = words;
		$scope.disableDictationButton = words.length == 0;
	}

	$scope.createAudio = function(word) {
		var audio = $('<audio></audio>');
		audio.append($('<source>').attr({ src: word.oggUrl, type: 'audio/ogg' }));
		audio.append($('<source>').attr({ src: word.url, type: 'audio/aac' }));
		return audio;
	}

	$scope.speakWord = function(word) {
		if ($scope.currentAudio) {
			$scope.currentAudio.pause();
		}
		$scope.currentAudio = $scope.createAudio(word)[0];
		$scope.currentAudio.play();
	}

	$scope.startDictation = function() {
		$scope.dictationSession = new DictationSession($scope.selectedWords);
		$scope.dictating = true;
		$scope.reloadPlayer($scope.dictationSession.getCurrentWord());
	}

	$scope.stopDictation = function() {
		delete $scope.dictationSession;
		$scope.dictating = false;
	}

	$scope.nextDictationWord = function() {
		$scope.dictationSession.next();
		$scope.reloadPlayer($scope.dictationSession.getCurrentWord());
	}

	$scope.endDictation = function() {
		$scope.dictationSession.end();
	}

	$scope.reloadPlayer = function(word) {
		var audio = $scope.createAudio(word).attr({ controls: true, autoplay: true });
		$('#player').html('').append(audio);
		// Autoplay doesn't work on iOS.
		// Calling play() immediately also doesn't work on iOS.
		setTimeout(function() {
			audio[0].play();
		}, 10);
	}

	$scope.isPresent = function(str) {
		return str != undefined && str != '';
	}

	indexAllWords();
	$scope.selectAllLists(true);
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
