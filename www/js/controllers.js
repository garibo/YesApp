angular.module('starter.controllers', ['ngCordova', 'ui.router'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  
})

.controller('pedidosCtrl', function($scope, $ionicLoading, ListaPedidos) {
    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });

    ListaPedidos.datos(1, function(data) {
      $scope.pedidos = data;
      $ionicLoading.hide();
    });

    $scope.fecha = function(dia)
    {
      moment.locale('es');
      return moment(dia).format('MMMM Do YYYY');
    }

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

})

.controller('ajustesCtrl', function($state, $scope) {
  $scope.ira = function()
  {
    $state.go('login');
  }
})

.controller('loginCtrl', function($scope, $cordovaOauth, $localstorage, $location, $http) {
   $scope.nombre = $localstorage.get('nombre');
   $scope.email = $localstorage.get('email');
   $scope.sexo = $localstorage.get('sexo');
   $scope.foto = $localstorage.get('foto');

   
   $scope.correof = $localstorage.get('correof');
   $scope.nombref = $localstorage.get('nombref');
   $scope.sexof = $localstorage.get('sexof');
   $scope.fotof = $localstorage.get('fotof');
  
  
   
  $scope.googleLogin = function()
  {
    $cordovaOauth.google("956498525722-bd18h7c72rpqutl22d6oqug36j3cq4ue.apps.googleusercontent.com", ["https://www.googleapis.com/auth/urlshortener", "https://www.googleapis.com/auth/userinfo.email"]).then(function(result) {
        alert(JSON.stringify(result));
        $scope.getDataProfile(result.access_token);
    }, function(error) {
        alert("8==D"+error);
    });
  }

  $scope.getDataProfile = function(accessToken){
    var term=null;
    $.ajax({
           url:'https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token='+accessToken,
           type:'GET',
           data:term,
           dataType:'json',
           error:function(jqXHR,text_status,strError){
           },
           success:function(data)
           {
           var item;

           console.log(JSON.stringify(data));
           alert(JSON.stringify(data));

           $scope.nombre = data.name;
           $scope.email = data.email;
           $scope.sexo = data.gender;
           $scope.foto = data.picture;

           $localstorage.set('nombre', data.name);
           $localstorage.set('email', data.email);
           $localstorage.set('sexo', data.gender);
           $localstorage.set('foto', data.picture);
           }
        });
  };

  $scope.facebookLogin = function() {
    $cordovaOauth.facebook("709455109197894", ["email", "public_profile", "user_friends"]).then(function(result) {
          $scope.accessToken = result.access_token;
          $scope.jalala($scope.accessToken);
      }, function(error) {
          alert("There was a problem signing in!  See the console for logs");
          alert(JSON.stringify(error));
      });

  };


  $scope.jalala = function(accessToken)
  {
    $http.get("https://graph.facebook.com/v2.2/me", { params: { access_token: accessToken, fields: "id,name,gender,location,website,picture,relationship_status, email", format: "json" }}).then(function(result) {
        alert(JSON.stringify(result.data));
           $scope.correof = result.data.email;
           $scope.nombref = result.data.name;
           $scope.sexof = result.data.gender;
           $scope.fotof = result.data.picture.data.url;
          $localstorage.set('nombref', result.data.name);
          $localstorage.set('correof', result.data.email);
          $localstorage.set('sexof', result.data.gender);
          $localstorage.set('fotof', result.data.picture.data.url);
    }, function(error) {
        alert("There was a problem getting your profile.  Check the logs for details.");
        console.log(error);
    });
  }
});