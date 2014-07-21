var mapOptions = {
	zoom: 15,
	//center: new google.maps.LatLng(-33.9, 151.2)
	center: new google.maps.LatLng(40.71, -74.00)
}
var map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);
google.maps.event.addListener(map, 'dragend', function() {
		if ($('#useCenter').is(':checked')) {
			var center = map.getCenter();
			var new_center = center['k']+','+center['B'];
			deleteMarkers();
			getEvents(new_center);
		}
	}
);
// google.maps.event.addListener(map, 'zoom_changed', function() {
// 		getEvents();
// 	}
// );
var events = [];
var markers = [];

function getEvents(center) {

	var url = 'http://api.nytimes.com/svc/events/v2/listings.jsonp';
	var key = 'ca4c9f9366bec636a98ef71d8b8e6df7:19:69565207';
	var radius = '10000';
	var latlng = (typeof center === "undefined") ? '40.7127,-74.0059' : center;
	var limit = '1000';
	var query = '';
	var ne = '';
	var sw = '';
	var filter = $("#filter").val();

	if ((0+$('#radius').val()) > 0 ){
		radius = $('#radius').val();
	}

	if ($('#query').val() != '' ){
		query = $('#query').val();
	}

	if ((0+$('#numresults').val()) > 0 ){
		limit = $('#numresults').val();
	}
	console.log('filter: '+filter);
	console.log('query: '+query);
	events = [];

	$.ajax({
		type: 'GET',
		url: url,
		data: { 'll':latlng, 'radius':radius, 'limit':limit, 'api-key':key, 'filters':filter, 'query':query },
		dataType: 'jsonp',
		success: function (data){
			results = data['results'];
			console.log(results);
			$.each( results, function (k,v) {
				current = v;
				events.push([v['event_name'],v['geocode_latitude'],v['geocode_longitude'],k,v['web_description'],v['venue_name'],v['venue_detail_url'],v['price'],v['event_detail_url'],v['date_time_description']]);
			})
			loadMarkers(events);
		}
	});
}

function loadMarkers(locations) {
	// Add markers to the map
	var image = {
	url: 'img/beachflag.png',
	size: new google.maps.Size(31, 31),
	origin: new google.maps.Point(0,0),
	anchor: new google.maps.Point(0, 31)
	};
	// Shapes define the clickable region of the icon.
	var shape = {
	coords: [1, 1, 1, 19, 20, 19, 20 , 1],
	type: 'poly'
	};

	/*
	* locations structure
	* [name,lat,lng,zindex,description,venue,venue_url,place,event_url,timing]
	*/

	var infoWindow = new google.maps.InfoWindow({content: '',maxWidth: '400'});
	console.log('locations: '+locations.length);
	for (var i = 0; i < locations.length; i++) {
		var location = locations[i];
		var myLatLng = new google.maps.LatLng(location[1], location[2]);
		var marker = new google.maps.Marker({
			position: myLatLng,
			clickable: true,
			map: map,
			icon: image,
			shape: shape,
			title: location[0],
			zIndex: location[3]
		});
		marker.text = '<div><h1><a target="_blank" href="'+location[8]+'">'+location[0]+'</a></h1><div>'+location[4]+'</div>';
		if(location[5] !== undefined){
			marker.text += '<div>Venue: <a target="_blank" href="'+location[6]+'">'+location[5]+'</a></div>';
		}
		if(location[7] !== undefined){
			marker.text += '<div>Price: '+location[7]+'</div>';
		}
		if(location[9] !== undefined){
			marker.text += '<div>Timing: '+location[9]+'</div></div>';
		}

		google.maps.event.addListener(marker, 'click', function() {
			infoWindow.content = this.text;
			infoWindow.open(this.getMap(),this)
		});
		markers.push(marker);
	}
}

// Sets the map on all markers in the array.
function setAllMap(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setAllMap(null);
}

// Shows any markers currently in the array.
function showMarkers() {
  setAllMap(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
  clearMarkers();
  markers = [];
}

// Deletes all markers in the array by removing references to them then gets new ones.
function refreshMarkers() {
  clearMarkers();
  markers = [];
  getEvents();
}

getEvents();

$(document).ready(function(){
	$('#sidebar input, #filter').change(function(){
		deleteMarkers();
		getEvents();
	});
});



