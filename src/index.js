import $ from 'jquery';
import './css/base.scss';
import './images/turing-logo.png';
import './images/travel-icon.svg';
import './images/log-in-icon.svg';
import Agent from './Agent.js';
import Destination from './Destination.js';
import Trip from './Trip.js';
import Traveler from './Traveler.js';
import DOMUpdate from './domUpdates.js';

let travelersEndPoint = 'https://fe-apps.herokuapp.com/api/v1/travel-tracker/1911/travelers/travelers/';
let tripsEndPoint = 'https://fe-apps.herokuapp.com/api/v1/travel-tracker/1911/trips/trips';
let destinationsEndPoint ='https://fe-apps.herokuapp.com/api/v1/travel-tracker/1911/destinations/destinations';

DOMUpdate.popUpLogIn(logIn);

function logIn() {
  if (validateLogIn()) {
    let userId = validateUsername();
    $('#log-in-button').attr('disabled', true);
    fetchData(userId);
  }
}

function validateLogIn() {
  if (!validateUsername()) {
    alert('user not found');
    return false;
  } else if (!validatePassword()) {
    alert('incorrect password');
    return false;
  } else {
    return true;
  }
}

function validatePassword() {
  let password = $('#password-input').val();
  return password === 'travel2020';
}

function validateUsername() {
  let username = $('#username-input').val();
  let logInFormat = RegExp('(?<=^traveler)(50$|[1-4][0-9]$|[1-9]$)', 'g');
  let userId = parseInt(username.match(logInFormat));
  return username === 'agency' || userId;
}

function fetchData(id) {
  fetch(destinationsEndPoint)
    .then(response => response.json())
    .then(data => {
      let destinations = data.destinations;
      fetchTrips(id, destinations);
    }).catch(error => console.log(error.message));
}

function fetchTrips(id, destinations) {
  fetch(tripsEndPoint)
    .then(response => response.json())
    .then(data => {
      let trips = data.trips.filter(trip => trip.userID === id);
      let userTrips = trips.map(trip => {
        let destination = destinations.find(destination => {
          return destination.id === trip.destinationID
        });
        let tripDestination = new Destination(destination);
        return new Trip(trip, tripDestination);
      });
      fetchUser(id, userTrips);
    }).catch(error => console.log(error.message));
}

function fetchUser(id, userTrips) {
  fetch(travelersEndPoint + id)
    .then(response => response.json())
    .then(data => {
      DOMUpdate.user = data.message ?
        new Agent() :
        new Traveler(data, userTrips);
      DOMUpdate.closeLogIn();
      DOMUpdate.user instanceof Agent ?
        DOMUpdate.loadAgentDashboard() :
        DOMUpdate.loadTravelerDashboard(validateTripRequest);
    }).catch(error => console.log(error.message));
}

function validateTripRequest(event) {
  if(validateFormFilled()) {
    console.log('not filled');
    return true;
  } if (validateDestination()) {
    console.log('invalid');
    alert('invalid destination');
    return false;
  }
  submitTripRequest();
  return false;
}

function validateFormFilled() {
  let filled = $('form input').filter(function() {
        return this.value !== "";
  }).length !== 4;
  return filled;
}

function validateDestination() {
  let destination = $('#destination-input').val();
  let destinationExists = Boolean($(`#destinations option[value='${destination}']`).length);
  return !destinationExists;
}

function submitTripRequest() {
  let newTrip = formatTrip(DOMUpdate.plannedTrip);
  $('#new-trip-button').attr('disabled', true);
  fetch(tripsEndPoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(newTrip)
  }).then(response => response.json())
  .then(data => {
    if (data.message.includes('success')) {
      DOMUpdate.user.addTrip(DOMUpdate.plannedTrip);
      DOMUpdate.loadTravelerDashboard(validateTripRequest);
    } else {
      alert(data.message);
      $('#new-trip-button').attr('disabled', false);
    }
  }).catch(error => console.log(error));
}

function formatTrip({id, userID, destinationID, travelers, date, duration}) {
  return {
    "id": id,
    "userID": userID,
    "destinationID": destinationID,
    "travelers": travelers,
    "date": date,
    "duration": duration,
    "status": "pending",
    "suggestedActivities": []
  };
}
