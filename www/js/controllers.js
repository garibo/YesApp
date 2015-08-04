angular.module('starter.controllers', ['ngCordova', 'ui.router'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  
})

.controller('pedidosCtrl', function($scope, $state) {

})

.controller('canastaCtrl', function($scope, $cordovaSQLite, $ionicPopup, $ionicModal, $cordovaGeolocation, Pedidos, $ionicLoading) {

  $scope.productos = [];
  $scope.total = 0;

  $scope.$on('$ionicView.leave', function(){
  $scope.productos = [];
  $scope.total = 0;
  });

  $scope.$on('$ionicView.enter', function(){
    var db = $cordovaSQLite.openDB("yesApp.db");
    var query = "SELECT * FROM canasta ORDER BY id DESC";
    $cordovaSQLite.execute(db, query, [])
    .then(function(res){
    if(res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
            $scope.productos.push(res.rows.item(i));
            $scope.total += res.rows.item(i).precio;
        };
    } else {
        alert("No results found");
    }
    }, function (err) {
        alert(err);
    }); 
  });

  $scope.eliminar = function(producto)
  {
    var db = $cordovaSQLite.openDB("yesApp.db");
    var query = "DELETE FROM canasta WHERE id = ?";
    var confirmPopup = $ionicPopup.confirm({
       title: producto.nombre,
       template: 'Estas seguro que deseas eliminarlo de la lista?',
       cancelText: 'Cancelar',
           okText: 'Eliminar'
     });
     confirmPopup.then(function(res) {
       if(res) {
         $cordovaSQLite.execute(db, query, [producto.id])
          .then(function(res){
            for(var i=0,len=$scope.productos.length;i<len;i++)
            {
              if($scope.productos[i].id == producto.id)
              {
                $scope.productos.splice(i,1);
                 $scope.total -= producto.precio;
                break;
              }
            }
          }, function (err) {
              alert(err);
          }); 
       } else {
         console.log('You are not sure');
       }
     });
  }

  $scope.pedirData = {};

  $ionicModal.fromTemplateUrl('templates/direccion.html', {
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
      
      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });
      var posOptions = {timeout: 10000, enableHighAccuracy: false};
      $cordovaGeolocation
      .getCurrentPosition(posOptions)
      .then(function (position) {

        Pedidos.nuevoPedido($scope.productos, position.coords.latitude, position.coords.longitude)
        .then(function(data) {
        if (data.respuesta === 'bien') {
           $ionicLoading.hide();
         } else {
        }
        }, function(error) {
        });
        
      }, function(err) {
        alert("Valio verga");
      });

  };
       
})

.controller('productosCtrl', function($scope, Pizzas, Platillos, Bebidas, $ionicLoading, $ionicPopup, $filter, $cordovaSQLite, $state, Precios) {
  $scope.pizzas = Pizzas.query(function(){
   $ionicLoading.hide();
    $scope.precios = Precios.query();
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
         template: '<p>'+platillo.nombre+'</p><p><strong>'+$filter('currency')(platillo.precio)+'</strong></p>',
         cancelText: 'Cancelar',
         okText: 'Ordenar'
       });
       confirmPopup.then(function(res) {
         if(res) {
           insertar(platillo.id, platillo.nombre, platillo.precio, platillo.ingredientes, null, platillo.imagen_url);
         } else {
           console.log('You are not sure');
         }
       });
   }

   $scope.agregarBebida = function(bebida)
   {
    var confirmPopup = $ionicPopup.confirm({
         title: 'Deseas ordenar esta bebida?',
         template: '<p>'+bebida.nombre+'</p><p><strong>'+$filter('currency')(bebida.precio)+'</strong></p>',
         cancelText: 'Cancelar',
         okText: 'Ordenar'
       });
       confirmPopup.then(function(res) {
         if(res) {
           insertar(bebida.id, bebida.nombre, bebida.precio, bebida.ingredientes, null, bebida.imagen_url);
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
      { text: 'Cancelar' },
      {
        text: '<b>Ordenar</b>',
        type: 'button-positive',
        onTap: function(e) {
          if (!$scope.data.precio) {
            //don't allow the user to close unless he enters wifi password
            e.preventDefault();
          } else {
            return $scope.data.precio;
          }
        }
      }
    ]
  });
  myPopup.then(function(res) {
    if(res) {
      for(var i = 0; i < $scope.precios.length; i++)
      {
        if($scope.precios[i].precio == res)
        {
          insertar(pizza.id, pizza.nombre, res, pizza.ingredientes, $scope.precios[i].id, pizza.imagen_url);
          break;
        } 

      }
      
     } else {
       console.log('You are not sure');
     }
  });
 }

  function insertar(id, nombre, precio, ingredientes, tamano, imagen) {
    var db = $cordovaSQLite.openDB("yesApp.db");
    var query = 'INSERT INTO canasta  (id_producto, nombre, precio, ingredientes, tamano, imagen_url) VALUES (?, ?, ?, ?, ?, ?)';
    $cordovaSQLite.execute(db, query, [id, nombre, precio, ingredientes, tamano, imagen]).then(function(res) {
       $state.go('app.canasta');
       }, function (err) {
        alert(JSON.stringify(err));
    });
  }

});