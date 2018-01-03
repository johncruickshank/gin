var MapWrapper = function(container, coords, zoom){
  this.googleMap = new google.maps.Map(container, {
    center: coords,
    zoom: zoom
  });
  this.directionInfoWindow = [];
  this.markers = [];
  //new markers will contain user location or search location
  this.newMarkers = [];
  this.directionDisplay = new google.maps.DirectionsRenderer({
    map: this.googleMap,
    markerOptions: {
      zIndex: -15,
      visible: false
    }
  });
  this.directionsShowing = true;
};

MapWrapper.prototype.addMarker = function(venue){
  var image = "/icons/bar-icon.png";
  var distilleryIcon = "/icons/distillery-icon.png";
  var image;
  if (venue.top3_gins[0].price === 0) {
    image = distilleryIcon;
  };
  var marker = new google.maps.Marker({
    id: venue._id,
    position: venue.coords,
    icon: image,
    map: this.googleMap
  });

  this.markers.push(marker);
  var star = '\u2605';
  var stars = new Array(venue.rating + 1).join(star);
  var multiplier = venue.rating;
  var contentString = '<div id="infoW-content">'+
  '<div id="infoW-bodyContent">'+
  `<h3 class="infoW-venue-name">${venue.name}</h3>` +
  `<h4 class="infoW-venue-rating">${stars}</h4>`+
  `<h5 class="infoW-open-time">Opens: ${venue.opening_times.open}</h5>`+
  `<h5 class="infoW-closed-time">Closes: ${venue.opening_times.closed}</h5>`+
  '</div>'+
  '</div>';
  marker.infowindow = new google.maps.InfoWindow({
    content: contentString
  });

  marker.addListener('click', function(){
    for (var mark of this.markers){
      if (mark.infowindowOpen){
        mark.infowindow.close();
      };
    };
    marker.infowindow.open(this.googleMap, marker);
    marker.infowindowOpen = true;
  }.bind(this));
};

MapWrapper.prototype.click = function(marker){
  google.maps.event.trigger(marker, "click");
};

MapWrapper.prototype.centerFunction = function(coords){
  this.googleMap.setCenter(coords);
  this.googleMap.setZoom(15);
};

MapWrapper.prototype.userLocation = function(){
  navigator.geolocation.getCurrentPosition(function(position){
    var coords = {lat: position.coords.latitude, lng: position.coords.longitude};
    this.googleMap.setCenter(coords);
    this.googleMap.setMapTypeId("roadmap");
    this.googleMap.setZoom(14);
    var marker = new google.maps.Marker({
      position: coords,
      icon: "/icons/user-location.png",
      infoWindowOpen: false,
      map: this.googleMap
    });

    var contentString = '<div id="content">' +
    '<div id="bodyContent">' +
    `<h3 id="user-loc">You are here</h3>` +
    '</div>' +
    '</div>';
    marker.infowindow = new google.maps.InfoWindow({
      content: contentString
    });
    marker.infowindow.open(this.googleMap, marker);
    marker.infowindowOpen = true;
    this.newMarkers.push(marker);
  }.bind(this));
};

MapWrapper.prototype.createSearchBox = function(input){
  // adapted from google docs search box example
  var searchBox = new google.maps.places.SearchBox(input);
  this.googleMap.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  // event listener for place selection
  searchBox.addListener("places_changed", function() {
    this.removeUserMarker();
    var places = searchBox.getPlaces();
    if (places.length == 0) {
      return;
    };
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      var newPlace = place;
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      };
      // Create a marker for each place.
      var icon = {
        url: "/icons/user-location.png",
      };
      this.createMarker(newPlace, icon, this.newMarkers);
      var contentString = '<div id="content">' +
      '<div id="bodyContent">' +
      `<h3 id="user-loc">You are here</h3>` +
      '</div>' +
      '</div>';
      var marker = this.newMarkers[0];
      marker.infowindow = new google.maps.InfoWindow({
        content: contentString
      });
      marker.infowindow.open(this.googleMap, marker);
      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      };
    }.bind(this));
    this.googleMap.fitBounds(bounds);
  }.bind(this));
};

MapWrapper.prototype.createMarker = function(place, icon, array){
  var newMarker = new google.maps.Marker({
    map: this.googleMap,
    icon: icon,
    title: place.name,
    position: place.geometry.location
  });
  array.push(newMarker);
};

MapWrapper.prototype.removeUserMarker = function(){
  if(this.newMarkers.length >= 1){
    var last = this.newMarkers.pop();
    last.setMap(null);
  }else{
    console.log("nothing to remove");
  };
};

MapWrapper.prototype.showRoute = function(map, markers, coords){
  function initMap(map, markers, directionsDisplay) {
    var userLocation = this.mainMap.newMarkers[0].getPosition();
    pointA = new google.maps.LatLng(userLocation.lat(), userLocation.lng());
    pointB = new google.maps.LatLng(coords.lat, coords.lng);
    // Instantiate a directions service.
    directionsService = new google.maps.DirectionsService;
    calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB);
  };

  function calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB) {
    directionsService.route({
      origin: pointA,
      destination: pointB,
      avoidTolls: true,
      avoidHighways: false,
      travelMode: google.maps.TravelMode.WALKING
    }, function (response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
        this.mainMap.distanceMatrix(pointA, pointB, response);
      } else {
        window.alert("Directions request failed due to " + status);
      };
    });
  };
  initMap(map, markers, this.directionDisplay);
}

MapWrapper.prototype.distanceMatrix = function(origin, destination, response){
  var routeResponse = response;
  var service = new google.maps.DistanceMatrixService();
  service.getDistanceMatrix(
    {
      origins: [origin],
      destinations: [destination],
      travelMode: "WALKING",
      unitSystem: google.maps.UnitSystem.IMPERIAL,
      avoidHighways: true,
      avoidTolls: true,
    }, function(response, status){
      callback(response, status, routeResponse);
    });

  function callback(response, status, routeResponse) {
    // adapted from google maps example
    if (status == "OK") {
      var origins = response.originAddresses;
      var destinations = response.destinationAddresses;
      console.log(origins);

      for (var i = 0; i < origins.length; i++) {
        var results = response.rows[i].elements;
        for (var j = 0; j < results.length; j++) {
          var element = results[j];
          var distance = element.distance.text;
          var duration = element.duration.text;
          var from = origins[i];
          var to = destinations[j];
        };
      };
    };
    var numSteps = routeResponse.routes[0].legs[0].steps.length;
    if ((numSteps % 2) !== 0){
      numSteps -= 1;
    };
    var step =  numSteps / 2;
    var directionInfoWindow = new google.maps.InfoWindow();
    directionInfoWindow.setContent("Walking:<br>" + distance + "<br>" + duration);
    directionInfoWindow.setPosition(routeResponse.routes[0].legs[0].steps[step].end_location);
    directionInfoWindow.open(this.mainMap.googleMap);
    this.mainMap.directionInfoWindow.push(directionInfoWindow);
  };
};


module.exports = MapWrapper;
