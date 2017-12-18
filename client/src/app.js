var MapWrapper = require('./models/mapWrapper');

var makeRequest = function(url, callback){
  var request = new XMLHttpRequest();
  request.open("GET", url);
  request.addEventListener('load', callback);
  request.send();
};

var requestComplete = function(){
  if (this.status !== 200) return console.log("Request failed");
  console.log("Request successful")
  var jsonString = this.responseText;
  var apiData = JSON.parse(jsonString);
  console.log(apiData);
  populateMap(apiData);
  populateList(apiData);
  dropDownMenu();
  sortList(apiData, "Edinburgh");
  sortList(apiData, "Glasgow");
  sortByRating(apiData);

};

var sortList = function(data, place){
  var selectedPlace = document.getElementById("" + `${place.toLowerCase()}` + "-bars");
  var selectedPlaceText = selectedPlace.innerText;
  selectedPlace.addEventListener("click", function(){
    var sortedBars = [];
    console.log(place);
    data.forEach(function(bar){
      if(bar.location === place){
        sortedBars.push(bar);
    }
      // var originalList = document.getElementById("bar-list");
      // removeChildNodes(originalList);
      populateList(sortedBars);
    });
  });
}

var sortDistilleries = function(){
  var selectedDistillery = document.getElementById("distilleries");
  selectedDistillery.addEventListener("click", function(){
      var url = "/distilleries";
      makeRequest(url, distilleriesRequestComplete);
  });
}

var sortByRating = function(data){
  var sortSelection = document.getElementById("favs");
  sortSelection.addEventListener("click", function(){
    console.log(data);
    var len = data.length;
    for(var i = len - 1; i >= 0; i--){
      for(var j=1; j<=i; j++){
        if(data[j-1].rating > data[j].rating){
          var temp = data[j - 1];
          data[j-1] = data[j];
          data[j] = temp;
        }
      }
    }
      populateList(data.reverse());
  });
}

var distilleriesRequestComplete = function(){
  if (this.status !== 200) return console.log("distillery request failed");
  console.log("Distillery Request successful")
  var jsonString = this.responseText;
  var apiData = JSON.parse(jsonString);
  console.log(apiData);
  populateList(apiData);
}

var removeChildNodes = function(node){
  while (node.hasChildNodes()) {
    node.removeChild(node.lastChild);
  }
}

var populateMap = function(apiData){
  var bars = apiData;
  var container = document.getElementById('map');
  var center = { lat: 56.740674, lng: -4.2187500 };
  var zoom = 7;
  mainMap = new MapWrapper(container, center, zoom);

  // geolocation
  mainMap.userLocation();
  // search box
  var input = document.createElement('input');
  input.id = "search-input";
  input.class = "controls";
  input.type = "text";
  input.placeholder = "Search for a location";
  console.log(input);
  // create new google maps search box from input element
  mainMap.createSearchBox(input);

  // populate map with bar markers
  bars.forEach(function(bar){
    mainMap.addMarker(bar);
  });
};

var populateList = function(data) {
  var originalList = document.getElementById("bar-list");
  removeChildNodes(originalList);
  var ul = document.getElementById("#list-header");
  for (var bar of data) {
    createBarData(bar);
  }
};
// create the bar list data and append to the header
var createBarData = function(bar) {
  var list = document.getElementById("bar-list");
  var completeBar = document.createElement("div");
  completeBar.className = "bar-complete";
  // create the visible elements
  var barVisible = document.createElement("div");
  barVisible.className = "bar-list-item";
  barVisible.appendChild(createBarDetails(bar.name, bar.address, bar.rating));
  barVisible.appendChild(createThumbnail(bar.image));
  completeBar.append(barVisible);

  //create and append the hidden elements
  var hiddenBar = document.createElement("div");
  hiddenBar.className = "hidden-details-panel";
  hiddenBar.appendChild(createHiddenDetails(bar.description));
  hiddenBar.appendChild(createTopGins(bar.top3_gins));
  completeBar.append(hiddenBar);
  list.append(completeBar);

  // list item click event listener
  completeBar.addEventListener("click", function(){
    // show/hide hidden panel
    hiddenBar.classList.toggle("hidden-details-panel");
    // var rect = completeBar.getBoundingClientRect();
    // console.log(rect.top, rect.left, rect.right);
    // window.scrollTo(0, rect.right);
    createFullImage(bar.image);
  });

  // connect list item to associated map marker
  // recenter map and open infoWindow when list item is clicked
  completeBar.addEventListener('click', function(){

    // get directions from geolocation to clicked bar
    mainMap.showRoute(mainMap.googleMap, mainMap.markers, bar.coords);
    // center map on clicked bar's marker
    mainMap.centerFunction(bar.coords);
    // simulate click on the bar marker to open it's infoWindow
    mainMap.markers.forEach(function(marker){
      if (marker.id === bar._id){
        mainMap.click(marker);
      }
    });
  });
};

var createBarDetails = function(name, address, rating) {
  var detailsElement = document.createElement("div");
  detailsElement.className = "bar-details";
  detailsElement.className = "bar-list-detail";
  var nameElement = document.createElement("div");
  nameElement.className = "bar-name";
  nameElement.append(name);
  var addressElement = document.createElement("div");
  addressElement.className = "bar-address";
  addressElement.append(address);
  var ratingElement = document.createElement("div");
  ratingElement.className = "bar-rating";
  var star = '\u2605';
  var stars = new Array(rating + 1).join(star);
  ratingElement.append(stars);
  detailsElement.append(nameElement);
  detailsElement.append(addressElement);
  detailsElement.append(ratingElement);
  return detailsElement;
};

var createHiddenDetails = function(description) {
  var hiddenElement = document.createElement("div");
  hiddenElement.className = "hidden-details-panel";
  hiddenElement.className = "hidden-details";
  hiddenElement.append(description);
  return hiddenElement;
};

var createThumbnail = function(image) {
  var thumbnailElement = document.createElement("div");
  thumbnailElement.id = "bar-thumbnail";
  var pic = document.createElement("img");
  thumbnailElement.appendChild(pic);
  pic.src = image;
  return thumbnailElement;
};

var createFullImage = function(image) {
  var fullImage = document.getElementById("list-header");
  while (fullImage.firstChild) {
    fullImage.removeChild(fullImage.firstChild);
  };
  var pic = document.createElement("img");
  pic.className = "big-picture";
  fullImage.appendChild(pic);
  pic.src = image;
  return fullImage;
};

var createTopGins = function(gins) {
  var ginList = document.createElement("div");
  ginList.id = "top-gin-list";
  ginList.innerText = "Top 3 Gins:";
  var ginUl = document.createElement("ul-top-gins");
  for (gin of gins) {
    var currentDrink = document.createElement("li");
    currentDrink.append(gin.name + ", ");
    currentDrink.append(gin.mixer + "   ");
    currentDrink.append("£" + gin.price);
    ginUl.append(currentDrink);
  };
  ginList.append(ginUl);
  return ginList;
};

var dropDownMenu = function(){
    var drop = document.getElementById("accountbtn");
    drop.addEventListener("click", function(){
    document.getElementById("myDropdown").classList.toggle("show");
  });
    var dropdowncontent = document.getElementById("myDropdown");
    dropdowncontent.addEventListener("click", function(){
    document.getElementById("myDropdown").classList.toggle("show");
  });
  sortDistilleries();
};



var timingDisplay = function(){
  var background = document.getElementById("background");
  background.style.zIndex = -1;
  var map = document.getElementById("map-container");
  map.style.zIndex = 1;
  var menu = document.querySelector(".dropdown");
  menu.style.zIndex = 1;
  var btn = document.querySelector(".dropdownbtn");
  btn.style.zIndex = 1;
};

var app = function() {
  console.log("Running app");
  var url = "/bars";
  makeRequest(url, requestComplete);
  var yes = document.getElementById("yes");
  yes.addEventListener("click", function(){
    window.scrollTo(0, 0);
    console.log("connected");
    var popup = document.getElementById("popup");
    popup.style.zIndex = -1;
    var foreground = document.getElementById("foreground");
    foreground.classList = "vanish";
    var timeout = setTimeout(function(){
      timingDisplay()}, 4000);
    console.log(this);
  });

};


window.addEventListener("load", app);
