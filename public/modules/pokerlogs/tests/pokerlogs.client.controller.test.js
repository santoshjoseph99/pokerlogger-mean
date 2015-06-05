'use strict';

(function() {
	// Pokerlogs Controller Spec
	describe('Pokerlogs Controller Tests', function() {
		// Initialize global variables
		var PokerlogsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Pokerlogs controller.
			PokerlogsController = $controller('PokerlogsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Pokerlog object fetched from XHR', inject(function(Pokerlogs) {
			// Create sample Pokerlog using the Pokerlogs service
			var samplePokerlog = new Pokerlogs({
				name: 'New Pokerlog'
			});

			// Create a sample Pokerlogs array that includes the new Pokerlog
			var samplePokerlogs = [samplePokerlog];

			// Set GET response
			$httpBackend.expectGET('pokerlogs').respond(samplePokerlogs);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.pokerlogs).toEqualData(samplePokerlogs);
		}));

		it('$scope.findOne() should create an array with one Pokerlog object fetched from XHR using a pokerlogId URL parameter', inject(function(Pokerlogs) {
			// Define a sample Pokerlog object
			var samplePokerlog = new Pokerlogs({
				name: 'New Pokerlog'
			});

			// Set the URL parameter
			$stateParams.pokerlogId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/pokerlogs\/([0-9a-fA-F]{24})$/).respond(samplePokerlog);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.pokerlog).toEqualData(samplePokerlog);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Pokerlogs) {
			// Create a sample Pokerlog object
			var samplePokerlogPostData = new Pokerlogs({
				name: 'New Pokerlog'
			});

			// Create a sample Pokerlog response
			var samplePokerlogResponse = new Pokerlogs({
				_id: '525cf20451979dea2c000001',
				name: 'New Pokerlog'
			});

			// Fixture mock form input values
			scope.name = 'New Pokerlog';

			// Set POST response
			$httpBackend.expectPOST('pokerlogs', samplePokerlogPostData).respond(samplePokerlogResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Pokerlog was created
			expect($location.path()).toBe('/pokerlogs/' + samplePokerlogResponse._id);
		}));

		it('$scope.update() should update a valid Pokerlog', inject(function(Pokerlogs) {
			// Define a sample Pokerlog put data
			var samplePokerlogPutData = new Pokerlogs({
				_id: '525cf20451979dea2c000001',
				name: 'New Pokerlog'
			});

			// Mock Pokerlog in scope
			scope.pokerlog = samplePokerlogPutData;

			// Set PUT response
			$httpBackend.expectPUT(/pokerlogs\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/pokerlogs/' + samplePokerlogPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid pokerlogId and remove the Pokerlog from the scope', inject(function(Pokerlogs) {
			// Create new Pokerlog object
			var samplePokerlog = new Pokerlogs({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Pokerlogs array and include the Pokerlog
			scope.pokerlogs = [samplePokerlog];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/pokerlogs\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePokerlog);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.pokerlogs.length).toBe(0);
		}));
	});
}());