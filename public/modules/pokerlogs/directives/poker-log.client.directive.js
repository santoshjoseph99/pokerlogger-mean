'use strict';

angular.module('pokerlogs').directive('pokerLog', ['lodash', '$location',
    function(lodash, $location) {
		return {
            templateUrl: 'modules/pokerlogs/directives/pokerlog.html',
			restrict: 'E',
            replace: true,
            scope: {
                pokerlog: '='
            },
			link: function postLink(scope, element, attrs) {

                scope.isWinner = function(){
                    return scope.pokerlog.cashout > lodash.sum(scope.pokerlog.buyins) ? 'pokerlog-winner' : 'pokerlog-loser';
                };

                scope.navigate = function(){
                    $location.path('pokerlogs/'+scope.pokerlog._id);
                };
			}
		};
	}
]);
