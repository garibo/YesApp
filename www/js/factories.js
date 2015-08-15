angular.module('starter.factories', ['ngResource'])

.factory('Pizzas',function($resource){
	return $resource('http://pizzeriayes.com/administrador/app/productos/pizzas/php/api/',{
		id : '@id'
		},{
		'update': { method:'PUT' }
	});
})

.factory('Platillos',function($resource){
	return $resource('http://pizzeriayes.com/administrador/app/productos/otros/php/api/',{
		id : '@id'
		},{
		'update': { method:'PUT' }
	});
})

.factory('Bebidas',function($resource){
	return $resource('http://pizzeriayes.com/administrador/app/productos/refrescos/php/api/',{
		id : '@id'
		},{
		'update': { method:'PUT' }
	});
})

.factory('Precios',function($resource){
	return $resource('http://pizzeriayes.com/administrador/app/ajustes/php/precios/api/',{
		id : '@id'
		},{
		'update': { method:'PUT' }
	});
})

.factory('Pedidos', function ($http, $q) {
    return {
        nuevoPedido: function(productosE, latitudE, longitudE) {
            return $http({
					method: "POST",
					url: "http://pizzeriayes.com/administrador/app/pedidos/php/dist/api/",
					data: {
						"id_cliente" : 1,
						"id_direccion" : 1,
						"id_telefono" : 1,
						"latitud" : latitudE,
						"longitud" : longitudE,
						"productos" : productosE

					},
					headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
					})
					.then(function(response) {
		                if (typeof response.data === 'object') {
		                    return response.data;
		                } else {
		                    // invalid response
		                    return $q.reject(response.data);
		                }

		            }, function(response) {
		                // something went wrong
		                return $q.reject(response.data);
		            });
        }
    };
})


.factory('ListaPedidos', function($http){
return {
  datos: function (id, callback){
    $http({
      method: 'GET',
      url: 'http://pizzeriayes.com/administrador/app/pedidos/php/record/pedidos.php/'+id+''
    }).success(callback);
  }
};
})

.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}]);