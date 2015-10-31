



var Q = require('q');

var GoogleMapsAPI = require('googlemaps');

var config = {
	key: 'AIzaSyALajTCGOGkS_TZBAXyUkjtWdSk5t4TIyY',	// Server key
	secure: true
};

var gmAPI = new GoogleMapsAPI(config);

var api = {};

api.getDistanceFromOneToMany = function(origin, destinations) {
	var originString = '',
		destinationsString = '';
	
	originString = origin.latitude + ',' + origin.longitude;
	destinations.forEach(function(dest, index) {
		if (index > 0) destinationsString += '|';
		destinationsString += dest.latitude + ',' + dest.longitude;		
	});
	// console.log(originString, destinationsString);
	var request = {
        origins: originString,
        destinations: destinationsString,
        mode: 'driving',        
        units: 'metric',
        language: 'vi'
	};

	var d = Q.defer();
	gmAPI.distance(request, function(err, response) {		
		if (response.status === 'OK') {
			// console.log('response', response.rows[0].elements);
			var results = response.rows[0].elements.map(function(element, index) {
	            return {
	                distance: element.distance,
	                id: index
	            };
	        });                    
            d.resolve(results);
		} else {			
			d.reject(response.status + ': ' + response.error_message);
		}
	});
	return d.promise;
};

api.getClosestShippers = function(store, shippers, filter) {
	// filter shippers by status
	var validShippers = shippers.filter(function(shipper) {
		return shipper.status === filter.status;
	});

	return api.getDistanceFromOneToMany(store, validShippers)
	.then(function(results) {		
		// filter by radius
		results = results.filter(function(e) {
			return e.distance.value <= filter.radius;
		});

		// sort ascending by distance
		results = results.sort(function(e1, e2) {
			return e1.distance.value < e2.distance.value;
		});
		console.log('gmaputil', results);
		// get smallest distances
		results = results.slice(0, filter.limit);

		// convert to shipper id
		results = results.map(function(e) {
			return {
				shipperID: validShippers[e.id].shipperID,
				distanceText: e.distance.text
			};
		});		
		
		return results;
	}, function(err) {
		console.log('error', err);
	});
};

// (function test() {
// 	console.log('unit test -- googlemapUti');
// 	api.getDistanceFromOneToMany();
// })();

module.exports = api;           