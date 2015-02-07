'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'friendlyroad';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',  'ui.router', 'ui.bootstrap', 'ui.utils'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('friends');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('journeys');

'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('milestones');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('roadblocks');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('sherpas');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);

'use strict';


angular.module('core').controller('HomeController',['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;



	}
]);


'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
'use strict';

// Configuring the Friends module
angular.module('friends').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Friends', 'friends', 'dropdown', '/friends(/create)?');
		Menus.addSubMenuItem('topbar', 'friends', 'List Friends', 'friends');
		//Menus.addSubMenuItem('topbar', 'friends', 'New Friend', 'friends/create');
	}
]);

'use strict';

//Setting up route
angular.module('friends').config(['$stateProvider',
	function($stateProvider) {
		// Friends state routing
		$stateProvider.
		state('listFriends', {
				url: '/friends',
				templateUrl: 'modules/friends/views/list-friends.client.view.html'
		});

	}
]);


'use strict';

angular.module('friends').controller('FriendsCreateController', ['$scope', 'Friends', 'Notify',
    function($scope, Friends, Notify ) {
        // Friends create controller logic

        $scope.myStyleOptions = [
            {id: '1', opt:'Hermit'},
            {id: '2', opt:'Rabble Rowzer'},
            {id: '3', opt:'Puzzle Solver'},
            {id: '4', opt:'The Boss'},
            {id: '5', opt:'Social Butterfly'},
            {id: '6', opt:'Perfectionist'},
        ];

        // Create new Friends
        this.create = function() {
            // Create new Friend object
            var friend = new Friends ({
                firstName: this.firstName,
                lastName: this.lastName,
                email: this.email,
                skill1: this.skill1,
                skill2: this.skill2,
                wifm1: this.wifm1,
                founder: this.founder,
                myStyle: this.myStyle,
                website: this.website
            });

            // Redirect after save
            friend.$save(function(response) {

                Notify.sendMsg('NewFriend', {'id': response._id});

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
    }
]);


'use strict';

angular.module('friends').controller('FriendsUpdateController', ['$scope', 'Friends', 'Notify',
    function($scope, Friends, Notify ) {
        // Friendupdate controller logic

        $scope.myStyleOptions = [
            {id: '1', opt:'Hermit'},
            {id: '2', opt:'Rabble Rowzer'},
            {id: '3', opt:'Puzzle Solver'},
            {id: '4', opt:'The Boss'},
            {id: '5', opt:'Social Butterfly'},
            {id: '6', opt:'Perfectionist'},
        ];


        // Update existing Friend
        this.update = function(updatedFriend) {
            var friend = updatedFriend ;

            friend.$update(function(response) {

                Notify.sendMsg('UpdatedFriend', {'id': response._id});

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
    }
]);

'use strict';

// Friends controller


angular.module('friends').controller('FriendsController', ['$scope', '$stateParams', 'Authentication', 'Friends', '$modal', '$log',
	function($scope, $stateParams, Authentication, Friends, $modal, $log) {

		this.authentication = Authentication;

		// Find a list of Friends
		this.friends = Friends.query();

		// Open a modal window to Update a single friend record
		this.modalUpdate = function (size, selectedFriend) {

			var modalInstance = $modal.open({
				templateUrl: 'modules/friends/views/update-friend.modal.view.html',
				controller: ["$scope", "$modalInstance", "aFriend", function ($scope, $modalInstance, aFriend) {

					$scope.theFriend = {};

					$scope.theFriend = angular.copy(aFriend);


					$scope.ok = function () {
						$modalInstance.close();
					};

					$scope.cancel = function () {
						$modalInstance.dismiss('cancel');
					};
				}],
				size: size,
				resolve: {
					aFriend: function () {
						return selectedFriend;
					}
				}
			});

			modalInstance.result.then(function (selectedItem) {
				$scope.selected = selectedItem;
			}, function () {
				$log.info('Modal dismissed at: ' + new Date());
			});
		};




		// Open a modal window to Create a single friend record
		this.modalCreate = function (size) {

			var modalInstance = $modal.open({
				templateUrl: 'modules/friends/views/create-friend.modal.view.html',
				controller: ["$scope", "$modalInstance", function ($scope, $modalInstance) {

					$scope.ok = function () {
						$modalInstance.close();
					};

					$scope.cancel = function () {
						$modalInstance.dismiss('cancel');
					};
				}],
				size: size
			});

			modalInstance.result.then(function (selectedItem) {
			}, function () {
				$log.info('Modal dismissed at: ' + new Date());
			});
		};




		// Remove existing Friend
		this.remove = function( friend ) {
			if ( friend ) { friend.$remove();

				for (var i in this.friends ) {
					if (this.friends [i] === friend ) {
						this.friends.splice(i, 1);
					}
				}
			} else {
				this.friend.$remove(function() {
				});
			}
		};
	}
]);

'use strict';

angular.module('friends').directive('friendList', ['Friends', 'Notify',
    function(Friends, Notify) {

        return {
            restrict: 'E',
            transclude: true,
            templateUrl: 'modules/friends/views/friend-list-template.html',
            link: function(scope, element, attrs){

                //when a new friend is added, update the friend list

                Notify.getMsg('NewFriend', function(event, data) {

                    scope.friendsCtrl.friends = Friends.query();

                });

                Notify.getMsg('UpdatedFriend', function(event, data) {

                    scope.friendsCtrl.friends = Friends.query();

                });
            }
        };

    }]);

'use strict';

//Friends service used to communicate Friends REST endpoints
angular.module('friends').factory('Friends', ['$resource',
	function($resource) {
		return $resource('friends/:friendId', { friendId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);



'use strict';

angular.module('friends').factory('Notify', ['$rootScope',
    function($rootScope) {
        // Notify service logic
        // Public API

        var notify = {};

        notify.sendMsg = function(msg, data) {
            data = data || {};
            $rootScope.$emit(msg, data);

            console.log('message sent!');
        };

        notify.getMsg = function(msg, func, scope) {
            var unbind = $rootScope.$on(msg, func);

            if (scope) {
                scope.$on('destroy', unbind);
            }
        };

        return notify;
    }

]);

'use strict';

// Configuring the Articles module
angular.module('journeys').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Journeys', 'journeys', 'dropdown', '/journeys(/create)?');
		Menus.addSubMenuItem('topbar', 'journeys', 'List Journeys', 'journeys');
		//Menus.addSubMenuItem('topbar', 'journeys', 'New Journey', 'journeys/create');
	}
]);

'use strict';

//Setting up route
angular.module('journeys').config(['$stateProvider',
	function($stateProvider) {
		// Journeys state routing
		$stateProvider.
		state('listJourneys', {
			url: '/journeys',
			templateUrl: 'modules/journeys/views/list-journey.client.view.html'
		});
	}
]);

'use strict';

angular.module('journeys').controller('JourneysCreateController', ['$scope', 'Journeys', 'Notify',
    function($scope, Journeys, Notify ) {
        // Journeys create controller logic

        $scope.mainTechnologyOptions = [
            {id: '1', opt:'Ruby'},
            {id: '2', opt:'HTML5'},
            {id: '3', opt:'Python'},
            {id: '4', opt:'Nodejs'},
            {id: '5', opt:'CMS'},
            {id: '6', opt:'NonTech'}
        ];

        // Create new Journey
        this.create = function() {
            // Create new Journey object
            var journey = new Journeys ({
                description: this.description,
                mainTechnology: this.mainTechnology,
                initiator: this.initiator,
                googleDocs: this.googleDocs,
                recruiting: this.recruiting,
                sponsor: this.sponsor,
                stage: this.stage
            });

            // Redirect after save
            journey.$save(function(response) {

                Notify.sendMsg('NewJourney', {'id': response._id});

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
    }
]);


'use strict';

angular.module('journeys').controller('JourneysUpdateController', ['$scope', 'Journeys', 'Notify',
    function($scope, Journeys, Notify ) {
        // Journeys update controller logic

        $scope.mainTechnologyOptions = [
            {id: '1', opt:'Ruby'},
            {id: '2', opt:'HTML5'},
            {id: '3', opt:'Python'},
            {id: '4', opt:'Nodejs'},
            {id: '5', opt:'CMS'},
            {id: '6', opt:'NonTech'}
        ];


        // Update existing Journeys
        this.update = function(updatedJourney) {
            var journey = updatedJourney ;

            journey.$update(function(response) {

                Notify.sendMsg('UpdatedJourney', {'id': response._id});

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
    }
]);

'use strict';

// Journeys controller
angular.module('journeys').controller('JourneysController', ['$scope', '$stateParams','Authentication', 'Journeys', '$modal', '$log',
	function($scope, $stateParams, Authentication, Journeys, $modal, $log) {

		this.authentication = Authentication;

		// Find a list of Journey
		this.journeys = Journeys.query();


		// Open a modal window to Create a single journey record
		this.modalCreate = function (size) {

			var modalInstance = $modal.open({
				templateUrl: 'modules/journeys/views/create-journey.modal.view.html',
				controller: ["$scope", "$modalInstance", function ($scope, $modalInstance) {

					$scope.ok = function () {
						$modalInstance.close();
					};

					$scope.cancel = function () {
						$modalInstance.dismiss('cancel');
					};
				}],
				size: size
			});

			modalInstance.result.then(function (selectedItem) {
			}, function () {
				$log.info('Modal dismissed at: ' + new Date());
			});
		};

		// Open a modal window to Update a single journey record
		this.modalUpdate = function (size, selectedJourney) {

			var modalInstance = $modal.open({
				templateUrl: 'modules/journeys/views/update-journey.modal.view.html',
				controller: ["$scope", "$modalInstance", "aJourney", function ($scope, $modalInstance, aJourney) {

					$scope.theJourney = {};

					$scope.theJourney = angular.copy(aJourney);


					$scope.ok = function () {
						$modalInstance.close();
					};

					$scope.cancel = function () {
						$modalInstance.dismiss('cancel');
					};
				}],
				size: size,
				resolve: {
					aJourney: function () {
						return selectedJourney;
					}
				}
			});

			modalInstance.result.then(function (selectedItem) {
				$scope.selected = selectedItem;
			}, function () {
				$log.info('Modal dismissed at: ' + new Date());
			});
		};




		// Remove existing Journey
		this.remove = function(journey) {
			if ( journey ) {
				journey.$remove();

				for (var i in this.journeys) {
					if (this.journeys [i] === journey) {
						this.journeys.splice(i, 1);
					}
				}
			} else {
				this.journey.$remove(function() {

				});
			}
		};


	}
]);

'use strict';

angular.module('journeys').directive('journeyList', ['Journeys', 'Notify',
    function(Journeys, Notify) {

        return {
            restrict: 'E',
            transclude: true,
            templateUrl: 'modules/journeys/views/journey-list-template.html',
            link: function(scope, element, attrs){

                //when a new journey is added, update the journey list

                Notify.getMsg('NewJourney', function(event, data) {

                    scope.journeysCtrl.journeys = Journeys.query();

                });

                Notify.getMsg('UpdatedJourney', function(event, data) {

                    scope.journeysCtrl.journeys = Journeys.query();

                });
            }
        };

    }]);

'use strict';

//Journeys service used to communicate Journeys REST endpoints
angular.module('journeys').factory('Journeys', ['$resource',
	function($resource) {
		return $resource('journeys/:journeyId', { journeyId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);


'use strict';

angular.module('journeys').factory('Notify', ['$rootScope',
    function($rootScope) {
        // Notify service logic
        // Public API

        var notify = {};

        notify.sendMsg = function(msg, data) {
            data = data || {};
            $rootScope.$emit(msg, data);

        };

        notify.getMsg = function(msg, func, scope) {
            var unbind = $rootScope.$on(msg, func);

            if (scope) {
                scope.$on('destroy', unbind);
            }
        };

        return notify;
    }

]);

'use strict';

// Configuring the Articles module
angular.module('milestones').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Milestones', 'milestones', 'dropdown', '/milestones(/create)?');
		Menus.addSubMenuItem('topbar', 'milestones', 'List Milestones', 'milestones');
		//Menus.addSubMenuItem('topbar', 'milestones', 'New Milestone', 'milestones/create');
	}
]);

'use strict';

//Setting up route
angular.module('milestones').config(['$stateProvider',
	function($stateProvider) {
		// Milestones state routing
		$stateProvider.
		state('listMilestones', {
			url: '/milestones',
			templateUrl: 'modules/milestones/views/list-milestones.client.view.html'
		});
	}
]);




'use strict';

angular.module('milestones').controller('MilestonesCreateController', ['$scope', 'Milestones', 'Notify',
    function($scope, Milestones, Notify ) {
        // Milestones create controller logic

        $scope.achievementOptions = [
            {id: '1', opt:'Begin Journey'},
            {id: '2', opt:'Discovery'},
            {id: '3', opt:'Pivot'},
            {id: '4', opt:'Validate'},
            {id: '5', opt:'Other Side'}
        ];

        // Create new Milestone
        this.create = function() {
            // Create new Milestone object
            var milestone = new Milestones ({
                name: this.name,
                major: this.major,
                achievement: this.achievement,
                event: this.event,
                nextDate: this.nextDate
            });

            // Redirect after save
            milestone.$save(function(response) {

                Notify.sendMsg('NewMilestone', {'id': response._id});

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
    }
]);


'use strict';

angular.module('milestones').controller('MilestonesUpdateController', ['$scope', 'Milestones', 'Notify',
    function($scope, Milestones, Notify ) {
        // Milestones update controller logic

        $scope.achievementOptions = [
            {id: '1', opt:'Begin Journey'},
            {id: '2', opt:'Discovery'},
            {id: '3', opt:'Pivot'},
            {id: '4', opt:'Validate'},
            {id: '5', opt:'Other Side'}
        ];


        // Update existing Milestone
        this.update = function(updatedMilestone) {
            var milestone = updatedMilestone ;

            milestone.$update(function(response) {

                Notify.sendMsg('UpdatedMilestone', {'id': response._id});

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
    }
]);



'use strict';

// Milestones controller
angular.module('milestones').controller('MilestonesController', ['$scope', '$stateParams', 'Authentication', 'Milestones', '$modal','$log',
	function($scope, $stateParams, Authentication, Milestones, $modal, $log) {
		this.authentication = Authentication;

		// Find a list of Milestones

			this.milestones = Milestones.query();

		// Open a modal window to Create a single Milestone record
		this.modalCreate = function (size){
			var modalInstance = $modal.open({
				templateUrl: 'modules/milestones/views/create-milestone.modal.view.html',
				controller: ["$scope", "$modalInstance", function ($scope, $modalInstance) {

					$scope.ok = function () {
						$modalInstance.close();
					};

					$scope.cancel = function () {
						$modalInstance.dismiss('cancel');
					};
				}],
				size: size
			});
			modalInstance.result.then(function (selectedItem){

			}, function() {
				$log.info('Modal dismissed at: ' + new Date());
			});

		};

		// Open a modal window to Update a single Milestone record
		this.modalUpdate = function (size, selectedMilestone){
			var modalInstance = $modal.open({
				templateUrl: 'modules/milestones/views/update-milestone.modal.view.html',
				controller: ["$scope", "$modalInstance", "aMilestone", function ($scope, $modalInstance, aMilestone) {

					$scope.theMilestone = {};

					$scope.theMilestone = angular.copy(aMilestone);

					$scope.ok = function () {
						$modalInstance.close();
					};

					$scope.cancel = function () {
						$modalInstance.dismiss('cancel');
					};
				}],
				size: size,
				resolve: {
					aMilestone: function() {
						return selectedMilestone;
					}
				}
			});
			modalInstance.result.then(function (selectedItem){
				$scope.selected = selectedItem;

			}, function() {
				$log.info('Modal dismissed at: ' + new Date());
			});

		};


		// Remove existing Milestone
		this.remove = function(milestone) {
			if ( milestone ) {
				milestone.$remove();

				for (var i in this.milestones) {
					if (this.milestones [i] === milestone) {
						this.milestones.splice(i, 1);
					}
				}
			} else {
				this.milestone.$remove(function() {

				});
			}
		};
	}
]);

'use strict';

angular.module('milestones').directive('milestoneList', ['Milestones', 'Notify',
    function(Milestones, Notify) {

        return {
            restrict: 'E',
            transclude: true,
            templateUrl: 'modules/milestones/views/milestone-list-template.html',
            link: function(scope, element, attrs){

                //when a new milestone is added, update the milestone list

                Notify.getMsg('NewMilestone', function(event, data) {

                    scope.milestonesCtrl.milestones = Milestones.query();

                });

                Notify.getMsg('UpdatedMilestone', function(event, data) {

                    scope.milestonesCtrl.milestones = Milestones.query();

                });
            }
        };

    }]);

'use strict';

//Milestones service used to communicate Milestones REST endpoints
angular.module('milestones').factory('Milestones', ['$resource',
	function($resource) {
		return $resource('milestones/:milestoneId', { milestoneId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

angular.module('milestones').factory('Notify', ['$rootScope',
    function($rootScope) {
        // Notify service logic
        // Public API

        var notify = {};

        notify.sendMsg = function(msg, data) {
            data = data || {};
            $rootScope.$emit(msg, data);

        };

        notify.getMsg = function(msg, func, scope) {
            var unbind = $rootScope.$on(msg, func);

            if (scope) {
                scope.$on('destroy', unbind);
            }
        };

        return notify;
    }

]);

'use strict';

// Configuring the Articles module
angular.module('roadblocks').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Roadblocks', 'roadblocks', 'dropdown', '/roadblocks(/create)?');
		Menus.addSubMenuItem('topbar', 'roadblocks', 'List Roadblocks', 'roadblocks');
		//Menus.addSubMenuItem('topbar', 'roadblocks', 'New Roadblock', 'roadblocks/create');
	}
]);

'use strict';

//Setting up route
angular.module('roadblocks').config(['$stateProvider',
	function($stateProvider) {
		// Roadblocks state routing
		$stateProvider.
		state('listRoadblocks', {
			url: '/roadblocks',
			templateUrl: 'modules/roadblocks/views/list-roadblocks.client.view.html'
		});
	}
]);

'use strict';

angular.module('roadblocks').controller('RoadblocksCreateController', ['$scope', 'Roadblocks', 'Notify',
    function($scope, Roadblocks, Notify ) {
        // Roadblocks create controller logic

        $scope.nameOptions = [
            {id: '1', opt:'Time Machine'},
            {id: '2', opt:'Travel Guide'},
            {id: '3', opt:'Treasure Map'},
            {id: '4', opt:'Shady Tree'},
            {id: '5', opt:'Message in a Bottle'},
            {id: '6', opt:'Fire Side Chat'}
        ];

        // Create new Roadblocks
        this.create = function() {
            // Create new Roadblocks object
            var roadblock = new Roadblocks ({
                name: this.name,
                description: this.description,
                sherpa: this.sherpa,
                googleDocs: this.googleDocs

            });

            // Redirect after save
            roadblock.$save(function(response) {

                Notify.sendMsg('NewRoadblock', {'id': response._id});

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
    }
]);


'use strict';

angular.module('roadblocks').controller('RoadblocksUpdateController', ['$scope', 'Roadblocks', 'Notify',
    function($scope, Roadblocks, Notify ) {
        // Roadblocks update controller logic

        $scope.nameOptions = [
            {id: '1', opt:'Time Machine'},
            {id: '2', opt:'Travel Guide'},
            {id: '3', opt:'Treasure Map'},
            {id: '4', opt:'Shady Tree'},
            {id: '5', opt:'Message in a Bottle'},
            {id: '6', opt:'Fire Side Chat'}
        ];


        // Update existing Roadblock
        this.update = function(updatedRoadblock) {
            var roadblock = updatedRoadblock ;

            roadblock.$update(function(response) {

                Notify.sendMsg('UpdatedRoadbock', {'id': response._id});

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
    }
]);

'use strict';

// Roadblocks controller
angular.module('roadblocks').controller('RoadblocksController', ['$scope', '$stateParams', 'Authentication', 'Roadblocks', '$modal', '$log',
	function($scope, $stateParams, Authentication, Roadblocks, $modal, $log) {
		this.authentication = Authentication;

		//Find a list of Roadblocks
		this.roadblocks = Roadblocks.query();

		// Open a modal window to Create a single roadblock record
		this.modalCreate = function (size) {

			var modalInstance = $modal.open({
				templateUrl: 'modules/roadblocks/views/create-roadblock.modal.view.html',
				controller: ["$scope", "$modalInstance", function ($scope, $modalInstance) {

					$scope.ok = function () {
						$modalInstance.close();
					};

					$scope.cancel = function () {
						$modalInstance.dismiss('cancel');
					};
				}],
				size: size
			});

			modalInstance.result.then(function (selectedItem) {
			}, function () {
				$log.info('Modal dismissed at: ' + new Date());
			});
		};



		// Open a modal window to Update a single roadblock record
		this.modalUpdate = function (size, selectedRoadblock) {

			var modalInstance = $modal.open({
				templateUrl: 'modules/roadblocks/views/update-roadblock.modal.view.html',
				controller: ["$scope", "$modalInstance", "aRoadblock", function ($scope, $modalInstance, aRoadblock) {

					$scope.theRoadblock = {};

					$scope.theRoadblock = angular.copy(aRoadblock);


					$scope.ok = function () {
						$modalInstance.close();
					};

					$scope.cancel = function () {
						$modalInstance.dismiss('cancel');
					};
				}],
				size: size,
				resolve: {
					aRoadblock: function () {
						return selectedRoadblock;
					}
				}
			});

			modalInstance.result.then(function (selectedItem) {
				$scope.selected = selectedItem;
			}, function () {
				$log.info('Modal dismissed at: ' + new Date());
			});
		};





		// Remove existing Roadblock
		this.remove = function(roadblock) {
			if ( roadblock ) { 
				roadblock.$remove();

				for (var i in this.roadblocks) {
					if (this.roadblocks [i] === roadblock) {
						this.roadblocks.splice(i, 1);
					}
				}
			} else {
				this.roadblock.$remove(function() {
				});
			}
		};
	}
]);

'use strict';

angular.module('roadblocks').directive('roadblocksList', ['Roadblocks', 'Notify',
    function(Roadblocks, Notify) {

        return {
            restrict: 'E',
            transclude: true,
            templateUrl: 'modules/roadblocks/views/roadblock-list-template.html',
            link: function(scope, element, attrs){

                //when a new roadblock is added, update the roadblock list

                Notify.getMsg('NewRoadblock', function(event, data) {

                    scope.roadblocksCtrl.roadbocks = Roadblocks.query();

                });

                Notify.getMsg('UpdatedRoadblock', function(event, data) {

                    scope.roadblocksCtrl.roadblocks = Roadblocks.query();

                });
            }
        };

    }]);

'use strict';

angular.module('roadblocks').factory('Notify', ['$rootScope',
    function($rootScope) {
        // Notify service logic
        // Public API

        var notify = {};

        notify.sendMsg = function(msg, data) {
            data = data || {};
            $rootScope.$emit(msg, data);

        };

        notify.getMsg = function(msg, func, scope) {
            var unbind = $rootScope.$on(msg, func);

            if (scope) {
                scope.$on('destroy', unbind);
            }
        };

        return notify;
    }

]);

'use strict';

//Roadblocks service used to communicate Roadblocks REST endpoints
angular.module('roadblocks').factory('Roadblocks', ['$resource',
	function($resource) {
		return $resource('roadblocks/:roadblockId', { roadblockId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Configuring the Articles module
angular.module('sherpas').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Sherpas', 'sherpas', 'dropdown', '/sherpas(/create)?');
		Menus.addSubMenuItem('topbar', 'sherpas', 'List Sherpas', 'sherpas');
		//Menus.addSubMenuItem('topbar', 'sherpas', 'New Sherpa', 'sherpas/create');
	}
]);

'use strict';

//Setting up route
angular.module('sherpas').config(['$stateProvider',
	function($stateProvider) {
		// Sherpas state routing
		$stateProvider.
		state('listSherpas', {
			url: '/sherpas',
			templateUrl: 'modules/sherpas/views/list-sherpas.client.view.html'
		});
	}
]);

'use strict';

angular.module('sherpas').controller('SherpasCreateController', ['$scope', 'Sherpas', 'Notify',
    function($scope, Sherpas, Notify ) {
        // Sherpas create controller logic

        $scope.challengeOptions = [
            {id: 'Mentor', opt:'Mentor'},
            {id: 'Tester', opt:'Tester'},
            {id: 'Customer', opt:'Customer'},
            {id: 'Planner', opt:'Planner'},
            {id: 'Validator', opt:'Validator'}
        ];

        // Create new Sherpa
        this.create = function() {
            // Create new Sherpa object
            var sherpa = new Sherpas ({
                challenge: this.challenge,
                sherpa: this.sherpa,
                sherpaName: this.sherpaName
            });

            // Redirect after save
            sherpa.$save(function(response) {

                Notify.sendMsg('NewSherpa', {'id': response._id});

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
    }
]);


'use strict';

angular.module('sherpas').controller('SherpasUpdateController', ['$scope', 'Sherpas', 'Notify',
    function($scope, Sherpas, Notify ) {
        // Sherpas update controller logic

        $scope.challengeOptions = [
            {id: '1', opt:'Mentor'},
            {id: '2', opt:'Tester'},
            {id: '3', opt:'Customer'},
            {id: '4', opt:'Planner'},
            {id: '5', opt:'Validator'}
        ];


        // Update existing Sherpa
        this.update = function(updatedSherpa) {
            var sherpa = updatedSherpa ;

            sherpa.$update(function(response) {

                Notify.sendMsg('UpdatedSherpa', {'id': response._id});

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
    }
]);

'use strict';

// Sherpas controller
angular.module('sherpas').controller('SherpasController', ['$scope', '$stateParams', 'Authentication', 'Sherpas', '$modal', '$log', '$modal','$log',
	function($scope, $stateParams, Authentication, Sherpas, $modal, $log) {
		this.authentication = Authentication;
		// Find a list of Sherpas
		this.sherpas = Sherpas.query();

		// Open a modal update window to Create a single sherpa record
		this.modalCreate = function (size) {

			var modalInstance = $modal.open({
				templateUrl: 'modules/sherpas/views/create-sherpa.modal.view.html',
				controller: ["$scope", "$modalInstance", function ($scope, $modalInstance) {

					$scope.ok = function () {
						$modalInstance.close();
					};

					$scope.cancel = function () {
						$modalInstance.dismiss('cancel');
					};
				}],
				size: size
			});

			modalInstance.result.then(function (selectedItem) {
			}, function () {
				$log.info('Modal dismissed at: ' + new Date());
			});
		};
		// Open a modal update window to Update a single sherpa record
		this.modalUpdate = function (size, selectedSherpa) {

			var modalInstance = $modal.open({
				templateUrl: 'modules/sherpas/views/update-sherpa.modal.view.html',
				controller: ["$scope", "$modalInstance", "aSherpa", function ($scope, $modalInstance, aSherpa){

				$scope.theSherpa = {};
				$scope.theSherpa = angular.copy(aSherpa);
				$scope.ok = function () {
					$modalInstance.close();
				};

				$scope.cancel = function () {
					$modalInstance.dismiss('cancel');
				};
			}],
			size: size,
				resolve: {
				aSherpa: function () {
					return selectedSherpa;
				}
			}
		});

		modalInstance.result.then(function (selectedItem) {
			$scope.selected = selectedItem;
		}, function () {
			$log.info('Modal dismissed at: ' + new Date());
		});
	};

		//Remove existing Sherpa
		this.remove = function(sherpa) {
			if (sherpa) {
				sherpa.$remove();

				for (var i in this.sherpas) {
					if (this.sherpas [i] === sherpa) {
						this.sherpas.splice(i, 1);
					}
				}
			} else {
				this.sherpa.$remove(function () {
				});
			}
		};
	}
]);




'use strict';

angular.module('sherpas').directive('sherpaList', ['Sherpas', 'Notify',
    function(Sherpas, Notify) {

        return {
            restrict: 'E',
            transclude: true,
            templateUrl: 'modules/Sherpas/views/sherpa-list-template.html',
            link: function(scope, element, attrs){

                //when a new sherpa is added, update the sherpa list

                Notify.getMsg('NewSherpa', function(event, data) {

                    scope.sherpasCtrl.sherpas = Sherpas.query();

                });

                Notify.getMsg('UpdatedSherpa', function(event, data) {

                    scope.sherpasCtrl.sherpas = Sherpas.query();

                });
            }
        };

    }]);

'use strict';

angular.module('sherpas').factory('Notify', ['$rootScope',
    function($rootScope) {
        // Notify service logic
        // Public API

        var notify = {};

        notify.sendMsg = function(msg, data) {
            data = data || {};
            $rootScope.$emit(msg, data);

        };

        notify.getMsg = function(msg, func, scope) {
            var unbind = $rootScope.$on(msg, func);

            if (scope) {
                scope.$on('destroy', unbind);
            }
        };

        return notify;
    }

]);

'use strict';

//Sherpas service used to communicate Sherpas REST endpoints
angular.module('sherpas').factory('Sherpas', ['$resource',
	function($resource) {
		return $resource('sherpas/:sherpaId', { sherpaId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);



'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
