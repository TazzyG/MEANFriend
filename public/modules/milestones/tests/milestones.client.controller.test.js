'use strict';

(function() {
	// Milestones Controller Spec
	describe('Milestones Controller Tests', function() {
		// Initialize global variables
		var MilestonesController,
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

			// Initialize the Milestones controller.
			MilestonesController = $controller('MilestonesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Milestone object fetched from XHR', inject(function(Milestones) {
			// Create sample Milestone using the Milestones service
			var sampleMilestone = new Milestones({
				name: 'New Milestone'
			});

			// Create a sample Milestones array that includes the new Milestone
			var sampleMilestones = [sampleMilestone];

			// Set GET response
			$httpBackend.expectGET('milestones').respond(sampleMilestones);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.milestones).toEqualData(sampleMilestones);
		}));

		it('$scope.findOne() should create an array with one Milestone object fetched from XHR using a milestoneId URL parameter', inject(function(Milestones) {
			// Define a sample Milestone object
			var sampleMilestone = new Milestones({
				name: 'New Milestone'
			});

			// Set the URL parameter
			$stateParams.milestoneId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/milestones\/([0-9a-fA-F]{24})$/).respond(sampleMilestone);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.milestone).toEqualData(sampleMilestone);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Milestones) {
			// Create a sample Milestone object
			var sampleMilestonePostData = new Milestones({
				name: 'New Milestone'
			});

			// Create a sample Milestone response
			var sampleMilestoneResponse = new Milestones({
				_id: '525cf20451979dea2c000001',
				name: 'New Milestone'
			});

			// Fixture mock form input values
			scope.name = 'New Milestone';

			// Set POST response
			$httpBackend.expectPOST('milestones', sampleMilestonePostData).respond(sampleMilestoneResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Milestone was created
			expect($location.path()).toBe('/milestones/' + sampleMilestoneResponse._id);
		}));

		it('$scope.update() should update a valid Milestone', inject(function(Milestones) {
			// Define a sample Milestone put data
			var sampleMilestonePutData = new Milestones({
				_id: '525cf20451979dea2c000001',
				name: 'New Milestone'
			});

			// Mock Milestone in scope
			scope.milestone = sampleMilestonePutData;

			// Set PUT response
			$httpBackend.expectPUT(/milestones\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/milestones/' + sampleMilestonePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid milestoneId and remove the Milestone from the scope', inject(function(Milestones) {
			// Create new Milestone object
			var sampleMilestone = new Milestones({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Milestones array and include the Milestone
			scope.milestones = [sampleMilestone];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/milestones\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleMilestone);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.milestones.length).toBe(0);
		}));
	});
}());