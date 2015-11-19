



var Q = require('q');

var GoogleMapsAPI = require('googlemaps');

var config = {
	// key: 'AIzaSyALajTCGOGkS_TZBAXyUkjtWdSk5t4TIyY',	// Server key
	key: 'AIzaSyBeZoB6x9vE6s3okxnACQ2H_cprqfiI6aE',
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
	console.log("TTTTTTTTTTT", destinationsString);
	var request = {
        origins: originString,
        destinations: destinationsString,
        mode: 'driving',        
        units: 'metric',
        language: 'en'
	};

	var d = Q.defer();
	gmAPI.distance(request, function(err, response) {	
		if (err) {
			d.reject(err);			
		} else {
			if (response.status === 'OK') {
				var results = response.rows[0].elements.map(function(element, index) {
						return {
							distance: element.distance,
							duration: element.duration,
							id: index
						};
		        });
	            d.resolve(results);
			} else {			
				d.reject(response.status + ': ' + response.error_message);
			}
		}
	});
	return d.promise;
};

api.getClosestShippers = function(store, shippers, filter) {
	// filter shippers by status

	var validShippers = shippers.filter(function(shipper) {
		console.log('check validShippers', shipper);
		return (shipper.isConnected === filter.isConnected && shipper.numTasks < filter.maxTasks);
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
				
		// get smallest distances
		results = results.slice(0, filter.limit);

		// convert to shipper id
		results = results.map(function(e) {
			return {
				shipperID: validShippers[e.id].shipperID,
				distanceText: e.distance.text,
				durationText: e.duration.text
			};
		});		
		
		return results;
	})
	.catch(function(err) {
		console.log('getClosestShippers error', err);
	});
};

/*
	Input: geoText (String)
	Output: Promise({
		latitude: double
		longitude: double
	})
*/
api.getLatLng = function(geoText) {
    var d = Q.defer();
    geocoder.geocode({
        address: geoText
    }, function(results, status) {
        if (status === maps.GeocoderStatus.OK) {                    
            d.resolve({
                latitude: results[0].geometry.location.lat(),
                longitude: results[0].geometry.location.lng()
            });
        } else {
            d.reject('Geocode was not successful for the following reason: ' + status);            
        }
    });

    return d.promise;
};

module.exports = api;           