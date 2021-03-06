'use strict';

(function() {
	// Sherpas Controller Spec
	describe('Sherpas Controller Tests', function() {
		// Initialize global variables
		var SherpasController,
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

			// Initialize the Sherpas controller.
			SherpasController = $controller('SherpasController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Sherpa object fetched from XHR', inject(function(Sherpas) {
			// Create sample Sherpa using the Sherpas service
			var sampleSherpa = new Sherpas({
				name: 'New Sherpa'
			});

			// Create a sample Sherpas array that includes the new Sherpa
			var sampleSherpas = [sampleSherpa];

			// Set GET response
			$httpBackend.expectGET('sherpas').respond(sampleSherpas);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.sherpas).toEqualData(sampleSherpas);
		}));

		it('$scope.findOne() should create an array with one Sherpa object fetched from XHR using a sherpaId URL parameter', inject(function(Sherpas) {
			// Define a sample Sherpa object
			var sampleSherpa = new Sherpas({
				name: 'New Sherpa'
			});

			// Set the URL parameter
			$stateParams.sherpaId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/sherpas\/([0-9a-fA-F]{24})$/).respond(sampleSherpa);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.sherpa).toEqualData(sampleSherpa);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Sherpas) {
			// Create a sample Sherpa object
			var sampleSherpaPostData = new Sherpas({
				name: 'New Sherpa'
			});

			// Create a sample Sherpa response
			var sampleSherpaResponse = new Sherpas({
				_id: '525cf20451979dea2c000001',
				name: 'New Sherpa'
			});

			// Fixture mock form input values
			scope.name = 'New Sherpa';

			// Set POST response
			$httpBackend.expectPOST('sherpas', sampleSherpaPostData).respond(sampleSherpaResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Sherpa was created
			expect($location.path()).toBe('/sherpas/' + sampleSherpaResponse._id);
		}));

		it('$scope.update() should update a valid Sherpa', inject(function(Sherpas) {
			// Define a sample Sherpa put data
			var sampleSherpaPutData = new Sherpas({
				_id: '525cf20451979dea2c000001',
				name: 'New Sherpa'
			});

			// Mock Sherpa in scope
			scope.sherpa = sampleSherpaPutData;

			// Set PUT response
			$httpBackend.expectPUT(/sherpas\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/sherpas/' + sampleSherpaPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid sherpaId and remove the Sherpa from the scope', inject(function(Sherpas) {
			// Create new Sherpa object
			var sampleSherpa = new Sherpas({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Sherpas array and include the Sherpa
			scope.sherpas = [sampleSherpa];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/sherpas\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleSherpa);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.sherpas.length).toBe(0);
		}));
	});
}());