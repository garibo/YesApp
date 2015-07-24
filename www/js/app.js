angular.module('starter', ['ionic', 'starter.controllers', 'starter.factories', 'ngCordova'])

.run(function($ionicPlatform, $cordovaSQLite) {
  $ionicPlatform.ready(function() {

    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
    var db = $cordovaSQLite.openDB("yesApp.db");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS canasta ( id integer primary key autoincrement, id_producto integer, nombre varchar(35), precio numeric(15,2), ingredientes varchar(140), imagen_url varchar(200));");
    // $cordovaSQLite.execute(db, 'INSERT INTO canasta  (id_producto, nombre, precio, ingredientes, imagen_url) VALUES (1, "Megaburrito de asada", 40, "Asada", "burrito.png"), (2, "Pizza YES", 150, "de todo", "pizza.png");');
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
        controller: 'pedidosCtrl'
      }
    }
  })

  .state('app.canasta', {
    url: "/canasta",
    views: {
      'menuContent': {
        templateUrl: "templates/canasta.html",
        controller: 'canastaCtrl'
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
