_500px.init({
  sdk_key: '283fcd023d6b52589e68a447c00af9815233cf77'
});

var URL = "https://api.sandbox.amadeus.com/v1.2/flights/inspiration-search"
var flights = [];
var origin;
var maxPrice;
var departureStartDt;
var departureEndDt;
var duration;


var airport;
var city = "";
var country;
var lat;
var long;
var airportName;
var timezone;

function handle500response(res) {

  var images = res.data.photos

  images.forEach(function(image) {
    var imgUrl = image.image_url;

    var $image = $('<img>').attr("src",imgUrl).addClass('image');

    console.log($image);

    $('.rightside').empty();

    $image.appendTo('.rightside');

  })
}

function addPhoto(lat,long){

  var radius = '25mi';

  var searchOptions = {
    geo: lat + ',' + long + ',' + radius,
    only: 'Landscapes',
    image_size: 3,
    rpp: 1
  };

  _500px.api('/photos/search',searchOptions, function(response) {
    handle500response(response);
  })

}

function compilePopUp(airportURL,origin,destination,deptDt,returnDt,price,kayakUrl) {

  $.ajax({
      url: airportURL + "?user_key=91c9414bce889daadd506979fd3e9297",
      type: 'GET',
      crossDomain: true,
      dataType: 'jsonp',
      success: handleResponseAirport,
      error: function() { alert('Failed!'); },
  });

  // Render the flight in the detail view.
  $('#popUp h1').html(origin + ' to ' + destination);
  $('#popUp h2').html('Departure: ' + deptDt + ' -> Return: ' + returnDt);
  $('#popUp p.flightprices').html("From $" + price);
  $('#popUp a.popUpAction').attr('href', kayakUrl);

  setView('detail');
}

function handleResponseAirport(response) {
  airport = response.airports[0];
  console.log(airport);

  airportName = airport.name;
  city = airport.city;
  country = airport.country;
  lat = airport.lat;
  long = airport.lng;
  timezone = airport.timezone;

  $('#popUp p.airportname').html("Destination Airport: " + airportName);
  $('#popUp p.city').html("City: " + city);
  $('#popUp p.country').html("Country: " + country);
  $('#popUp p.lat').html("Lat: " + lat);
  $('#popUp p.long').html("Long: " + long);
  $('#popUp p.timezone').html("Timezone: " + timezone);

  addPhoto(lat,long);
}

function findOrigin(input){
  return input.name === "element_1";
}

function findMaxPrice(input){
  return input.name === "element_2";
}

function findDepartureStartYr(input){
  return input.name === "element_3_3";
}

function findDepartureStartMo(input){
  return input.name === "element_3_1";
}

function findDepartureStartDay(input){
  return input.name === "element_3_2";
}

function findDepartureEndYr(input){
  return input.name === "element_4_3";
}

function findDepartureEndMo(input){
  return input.name === "element_4_1";
}

function findDepartureEndDay(input){
  return input.name === "element_4_2";
}

function findOrigin(input){
  return input.name === "element_1";
}

function findDuration(input){
  return input.name === "element_5";
}

function adjustDay(day){
  if (day.length === 1) {
    day = "0" + day;
  }
  return day;
}

function assignParams(data){
  origin = data.find(findOrigin).value;
  maxPrice = data.find(findMaxPrice).value;
  duration = data.find(findDuration).value;

  var departureStartDay = data.find(findDepartureStartDay).value;
  var departureEndDay = data.find(findDepartureEndDay).value;

  departureStartDay = adjustDay(departureStartDay);
  departureEndDay = adjustDay(departureEndDay);

  if (departureEndDay.length === 1) {
    departureEndDay = "0" + departureStartDay
  }  

  departureStartDt = data.find(findDepartureStartYr).value + '-' + data.find(findDepartureStartMo).value + '-' + departureStartDay;

  departureEndDt = data.find(findDepartureEndYr).value + '-' + data.find(findDepartureEndMo).value + '-' + departureEndDay;

}

function flightToHTML(flight) {
	imgUrl = "https://cdn1.vtourist.com/13/2729826-The_Rainbow_Room-New_York_City.jpg"

  return '<flight class="flight">' +
         '  <section class="flightContent">' +
         '    <a href="#"><h3>' + origin + ' to ' + flight.destination + '</h3></a>' +
         '    <h6>Departure: ' + flight.departure_date + ' -> Return: ' + flight.return_date + '</h6>' +
         '  </section>' +
         '  <section class="impressions">From $' +
              flight.price +
         '  </section>' +
         '  <div class="clearfix"></div>' +
         '</flight>';
}

function setView(viewType) {
  var $popup = $('#popUp');

  if (viewType === 'loader') {
    $popup.removeClass('hidden');
    $popup.addClass('loader');
  } 
  else if (viewType === 'detail') {
    $popup.removeClass('hidden');
    $popup.removeClass('loader');
  } 
  else if (viewType === 'feed') {
    $popup.addClass('hidden');
  } 
  else {

    throw new Error("Only acceptable arguments to setView " +
                    "are 'loader', 'detail' and 'feed'");
  }
}

function renderFlights() {
  // Remove existing flights from DOM
  $('#main').empty();

  // Add new flights to DOM
  flights.forEach(function(flight) {
    var renderedHTML = flightToHTML(flight)
    $('#main').append(renderedHTML);
  });

  setView('feed');
}

function handleResponseSuccess(response) {
	//console.log(response);

	flights = response.results;

	renderFlights();

  $('#form_1143858').slideUp();

}

// SET EVENT LISTENERS:

// Go to article detail
$('#main.container').on('click', '.flight a', function(event) {

  var index = $(this).parent().parent().index();
  var flight = flights[index];

  var destination = flight.destination;
  var deptDt = flight.departure_date;
  var returnDt = flight.return_date;
  var price = flight.price;

  var kayakUrl = ("https://www.kayak.com/flights/" + origin + "-" + destination + "/" +  deptDt + "/" + returnDt);

  var airportURL = "https://airport.api.aero/airport/";
  airportURL += destination;

  compilePopUp(airportURL,origin,destination,deptDt,returnDt,price,kayakUrl);

});

// Go back to main feed when `X` is clicked in popup
$('.closePopUp').on('click', function(event) {
  setView('feed');
});

// Go back to default feed when Feedr logo is clicked
// (This doesn't really do anything yet because there's
// only one feed)
$('header .logo').on('click', function(event) {
  setView('feed');
});


$('#form_1143858').on('submit', function(e) { 
    e.preventDefault();  //prevent form from submitting
    var data = $("#form_1143858 :input").serializeArray();
    console.log(data); //use the console for debugging, F12 in Chrome, not alerts

    assignParams(data);

    $.get(URL,{apikey: "anX2VJt2NOCMALM6TQ5WodGfqJ0GTpyz",origin: origin, max_price: maxPrice, departure_date: departureStartDt + '--' + departureEndDt, duration: duration, direct: true},function(response){
      handleResponseSuccess(response);
    })

});








