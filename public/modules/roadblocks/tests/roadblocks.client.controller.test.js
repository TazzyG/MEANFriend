'use strict';

(function() {
	// Roadblocks Controller Spec
	describe('Roadblocks Controller Tests', function() {
		// Initialize global variables
		var RoadblocksController,
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

			// Initialize the Roadblocks controller.
			RoadblocksController = $controller('RoadblocksController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Roadblock object fetched from XHR', inject(function(Roadblocks) {
			// Create sample Roadblock using the Roadblocks service
			var sampleRoadblock = new Roadblocks({
				name: 'New Roadblock'
			});

			// Create a sample Roadblocks array that includes the new Roadblock
			var sampleRoadblocks = [sampleRoadblock];

			// Set GET response
			$httpBackend.expectGET('roadblocks').respond(sampleRoadblocks);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.roadblocks).toEqualData(sampleRoadblocks);
		}));

		it('$scope.findOne() should create an array with one Roadblock object fetched from XHR using a roadblockId URL parameter', inject(function(Roadblocks) {
			// Define a sample Roadblock object
			var sampleRoadblock = new Roadblocks({
				name: 'New Roadblock'
			});

			// Set the URL parameter
			$stateParams.roadblockId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/roadblocks\/([0-9a-fA-F]{24})$/).respond(sampleRoadblock);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.roadblock).toEqualData(sampleRoadblock);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Roadblocks) {
			// Create a sample Roadblock object
			var sampleRoadblockPostData = new Roadblocks({
				name: 'New Roadblock'
			});

			// Create a sample Roadblock response
			var sampleRoadblockResponse = new Roadblocks({
				_id: '525cf20451979dea2c000001',
				name: 'New Roadblock'
			});

			// Fixture mock form input values
			scope.name = 'New Roadblock';

			// Set POST response
			$httpBackend.expectPOST('roadblocks', sampleRoadblockPostData).respond(sampleRoadblockResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Roadblock was created
			expect($location.path()).toBe('/roadblocks/' + sampleRoadblockResponse._id);
		}));

		it('$scope.update() should update a valid Roadblock', inject(function(Roadblocks) {
			// Define a sample Roadblock put data
			var sampleRoadblockPutData = new Roadblocks({
				_id: '525cf20451979dea2c000001',
				name: 'New Roadblock'
			});

			// Mock Roadblock in scope
			scope.roadblock = sampleRoadblockPutData;

			// Set PUT response
			$httpBackend.expectPUT(/roadblocks\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/roadblocks/' + sampleRoadblockPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid roadblockId and remove the Roadblock from the scope', inject(function(Roadblocks) {
			// Create new Roadblock object
			var sampleRoadblock = new Roadblocks({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Roadblocks array and include the Roadblock
			scope.roadblocks = [sampleRoadblock];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/roadblocks\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleRoadblock);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.roadblocks.length).toBe(0);
		}));
	});
}());