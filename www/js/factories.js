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
});