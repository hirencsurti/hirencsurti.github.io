URL = "https://api.sandbox.amadeus.com/v1.2/flights/inspiration-search"
var flights = [];
var origin;
var maxPrice;
var departureStartDt;
var departureEndDt;
var duration;


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

  // console.log(origin);
  // console.log(maxPrice);
  // console.log(duration);
  // console.log(departureStartDt);
  // console.log(departureEndDt);

}

function flightToHTML(flight) {
	imgUrl = "https://cdn1.vtourist.com/13/2729826-The_Rainbow_Room-New_York_City.jpg"

  return '<flight class="flight">' +
         '  <section class="featuredImage">' +
         '    <img src="' + imgUrl + '" alt="" />' +
         '  </section>' +
         '  <section class="flightContent">' +
         '    <a href="#"><h3>NYC to ' + flight.destination + '</h3></a>' +
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
    // This `else` clause is optional but useful
    // if you (the programmer) forget the system 
    // of viewTypes that you worked out, and 
    // use a wrong one.
    throw new Error("Only acceptable arguments to setView " +
                    "are 'loader', 'detail' and 'feed'");
  }
}

function renderFlights() {
  // Remove existing flights from DOM
  $('#main').empty();

  // Add new articles to DOM
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

  // Get the right article object, which we can do because the 
  // article elements in the feed in the DOM will be in the 
  // same order as the ones in the articles array.
  var index = $(this).parent().parent().index();
  var flight = flights[index];

  // Render the article in the detail view.
  $('#popUp h1').html('NYC to ' + flight.destination);
  $('#popUp p').html("From $" + flight.price);
  $('#popUp a.popUpAction').attr('href', 'www.google.com');

  setView('detail');
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

