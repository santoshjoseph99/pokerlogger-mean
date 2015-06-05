'use strict';

// Pokerlogs controller
angular.module('pokerlogs').controller('PokerlogsController', ['$scope', '$stateParams', '$location', 'Authentication',
    'Pokerlogs', 'lodash', '$window',
	function($scope, $stateParams, $location, Authentication, Pokerlogs, lodash, $window) {
		$scope.authentication = Authentication;
        $scope.tournament = false;

        $scope.isWinner = function(pokerlog){
            return pokerlog.cashout > lodash.sum(pokerlog.buyins) ? 'pokerlog-winner' : 'pokerlog-loser';
        };

		// Create new Pokerlog
		$scope.create = function() {

            var buyinsArray = lodash.map(this.buyins.split(','), function(e){
                return parseInt(e);
            });

			// Create new Pokerlog object
			var pokerlog = new Pokerlogs ({
				location: this.location,
				start: this.start,
                end: this.end,
                gametype: this.gametype,
                cashout: this.cashout,
                limits: this.limits,
                placed: this.placed,
                buyins: buyinsArray,
                notes: this.notes
			});

			// Redirect after save
			pokerlog.$save(function(response) {
				$location.path('pokerlogs/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

        $scope.navigate = function(id){
            $location.path('pokerlogs/'+id);
        };

		// Remove existing Pokerlog
		$scope.remove = function(pokerlog) {
            if(!$window.confirm('Are you sure you want to remove this log?')){
                return;
            }
			if ( pokerlog ) {
				pokerlog.$remove();

				for (var i in $scope.pokerlogs) {
					if ($scope.pokerlogs [i] === pokerlog) {
						$scope.pokerlogs.splice(i, 1);
					}
				}
			} else {
				$scope.pokerlog.$remove(function() {
					$location.path('pokerlogs');
				});
			}
		};

		// Update existing Pokerlog
		$scope.update = function() {
			var pokerlog = $scope.pokerlog;

			pokerlog.$update(function() {
				$location.path('pokerlogs/' + pokerlog._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Pokerlogs
		$scope.find = function() {
			$scope.pokerlogs = Pokerlogs.query();
		};

		// Find existing Pokerlog
		$scope.findOne = function() {
			$scope.pokerlog = Pokerlogs.get({ 
				pokerlogId: $stateParams.pokerlogId
			});
            $scope.pokerlog.$promise.then(function(pl){
                $scope.tournament = typeof(pl.limits) === 'undefined';
            });
		};
	}
]);
