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

.controller('productosCtrl', function($scope, Pizzas, Platillos, Bebidas, $ionicLoading) {
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


});