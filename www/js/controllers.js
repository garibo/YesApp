angular.module('starter.controllers', [])

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

.controller('pedidosCtrl', function($scope) {

})

.controller('canastaCtrl', function($scope) {

})

.controller('productosCtrl', function($scope, Pizzas, Platillos, Bebidas, $ionicLoading, $ionicPopup, $filter) {
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
           console.log('You are sure');
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
           console.log('You are sure');
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

});