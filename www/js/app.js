angular.module('starter', ['ionic', 'starter.controllers', 'starter.factories'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {

    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.pedidos', {
    url: "/pedidos",
    views: {
      'menuContent': {
        templateUrl: "templates/pedidos.html",
        controller: 'tabController'
      }
    }
  })

  .state('app.pizzas', {
    url: "/pizzas",
    views: {
      'menuContent': {
        templateUrl: "templates/pizzas.html",
        controller: 'productosCtrl'
      }
    }
  })

  .state('app.ajustes', {
    url: "/ajustes",
    views: {
      'menuContent': {
        templateUrl: "templates/ajustes.html"
      }
    }
  });

  $urlRouterProvider.otherwise('/app/ajustes');
});
