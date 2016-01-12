// app is called app
// app.auth loads authentication controller
// app.trip loads the tripViewController
// app.landing loads the landing controller
// app.create loads the createTrip controller
// app.services loads all factory/service functionality
// app.mytrips loads myTrips controller
// ngRoute is for angular routing
angular.module('app', ['app.auth', 'app.trip', 'app.landing', 'app.create', 'app.services', 'app.mytrips', 'ngRoute'])


.config(function ($routeProvider) {
  $routeProvider
    // landing page
    .when('/', {
      templateUrl: './js/templates/landing.html',
      controller: 'LandingController',
      authenticate: true
    })
    // login page
    .when('/login', {
      templateUrl: './js/templates/login.html',
      controller: 'AuthController'
    })
    // signup page
    .when('/signup', {
      templateUrl: './js/templates/signup.html',
      controller: 'AuthController'
    })
    // trip creation page
    .when('/create', {
      templateUrl: './js/templates/createTrip.html',
      controller: 'CreateTripController',
      authenticate: true
    })
    // myTrips page
    .when('/myTrips', {
      templateUrl: './js/templates/mytrips.html',
      controller: 'MyTripsController',
      authenticate: true
    })
    // splash page
    .when('/splash', {
      templateUrl: './js/templates/splash.html',
    })
    // single trip page
    .when('/trip/:id', {
      templateUrl: './js/templates/tripView.html',
      controller: 'TripController',
      authenticate: true
    })
    .otherwise('/');
})
.factory('AttachTokens', function ($window) {
  // this is an $httpInterceptor
  // its job is to stop all out going request
  // then look in local storage and find the user's token
  // then add it to the header so the server can validate the request
  var attach = {
    request: function (object) {
      var jwt = $window.localStorage.getItem('com.app');
      if (jwt) {
        object.headers['x-access-token'] = jwt;
      }
      object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
    }
  };
  return attach;
})
.run(function ($rootScope, $location, Auth) {
  // here inside the run phase of angular, our services and controllers
  // have just been registered and our app is ready
  // however, we want to make sure the user is authorized
  // we listen for when angular is trying to change routes
  // when it does change routes, we then look for the token in localstorage
  // and send that token to the server to see if it is a real user or hasn't expired
  // if it's not valid, we then redirect back to signin/signup
  $rootScope.$on('$routeChangeStart', function (evt, next, current) {
    if (next.$$route && next.$$route.authenticate && !Auth.isAuth()) {
      $location.path('/signin');
    }
  });
});