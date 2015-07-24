angular.module('starter.controllers', [, 'ngCordova', 'ui.router'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  
  
  $scope.loginData = {};

  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  $scope.login = function() {
    $scope.modal.show();
  };

  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

})

.controller('pedidosCtrl', function($scope, $state) {

})

.controller('canastaCtrl', function($scope, $cordovaSQLite, $state) {
  $state.go($state.current, {}, {reload: true});

  $scope.productos = [];
  db = $cordovaSQLite.openDB("yesApp.db");
  var query = "SELECT * FROM canasta";
  $cordovaSQLite.execute(db, query, [])
  .then(function(res){
  if(res.rows.length > 0) {
      for (var i = 0; i < res.rows.length; i++) {
          $scope.productos.push(res.rows.item(i));
      };
  } else {
      alert("No results found");
  }
  }, function (err) {
      alert(err);
  }); 

       
})

.controller('productosCtrl', function($scope, Pizzas, Platillos, Bebidas, $ionicLoading, $ionicPopup, $filter, $cordovaSQLite, $state, $stateParams) {
  $scope.pizzas = Pizzas.query(function(){
    
   $ionicLoading.hide();
  },function(){

  });
  $scope.platillos = Platillos.query();
  $scope.bebidas = Bebidas.query();

   $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });

   $scope.agregarPlatillo = function(platillo)
   {
       var confirmPopup = $ionicPopup.confirm({
         title: 'Deseas ordenar este platillo?',
         template: '<p>'+platillo.nombre+'</p><p><strong>'+$filter('currency')(platillo.precio)+'</strong></p>'
       });
       confirmPopup.then(function(res) {
         if(res) {
           insertar(platillo.id, platillo.nombre, platillo.precio, platillo.ingredientes, platillo.imagen_url);
         } else {
           console.log('You are not sure');
         }
       });
   }

   $scope.agregarBebida = function(bebida)
   {
    var confirmPopup = $ionicPopup.confirm({
         title: 'Deseas ordenar esta bebida?',
         template: '<p>'+bebida.nombre+'</p><p><strong>'+$filter('currency')(bebida.precio)+'</strong></p>'
       });
       confirmPopup.then(function(res) {
         if(res) {
           insertar(bebida.id, bebida.nombre, bebida.precio, bebida.ingredientes, bebida.imagen_url);
         } else {
           console.log('You are not sure');
         }
       });
   }

   $scope.agregarPizza = function(pizza) {
  $scope.data = {}

  // An elaborate, custom popup
  var myPopup = $ionicPopup.show({
    templateUrl : 'templates/precios.html',
    title: 'Escoja el tamaño de su Pizza',
    subTitle: ''+pizza.nombre,
    scope: $scope,
    buttons: [
      { text: 'Cancel' },
      {
        text: '<b>Save</b>',
        type: 'button-positive',
        onTap: function(e) {
          if (!$scope.data.wifi) {
            //don't allow the user to close unless he enters wifi password
            e.preventDefault();
          } else {
            return $scope.data.wifi;
          }
        }
      }
    ]
  });
  myPopup.then(function(res) {
    console.log('Tapped!', res);
  });
 }

  function insertar(id, nombre, precio, ingredientes, imagen) {
    var db = $cordovaSQLite.openDB("yesApp.db");
    var query = 'INSERT INTO canasta  (id_producto, nombre, precio, ingredientes, imagen_url) VALUES (?, ?, ?, ?, ?)';
    $cordovaSQLite.execute(db, query, [id, nombre, precio, ingredientes, imagen]).then(function(res) {
        // alert("Ha sido insertado ");
        $state.transitionTo("app.canasta", $stateParams, {
            reload: true,
            inherit: false,
            notify: true
        });
       }, function (err) {
        alert(JSON.stringify(err));
    });
  }

});