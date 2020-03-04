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
let tripsEndPoint = 'https://fe-apps.herokuapp.com/api/v1/travel-tracker/1911/trips/';
let destinationsEndPoint = 'https://fe-apps.herokuapp.com/api/v1/travel-tracker/1911/destinations/destinations/';

DOMUpdate.popUpLogIn(logIn);

function logIn() {
  if (validateLogIn()) {
    let userId = getUserId();
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
  let userId = getUserId();
  return username === 'agency' || userId;
}

function getUserId() {
  let username = $('#username-input').val();
  let logInFormat = RegExp('(?<=^traveler)(50$|[1-4][0-9]$|[1-9]$)', 'g');
  let userId = parseInt(username.match(logInFormat));
  return userId || '';
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
  fetch(tripsEndPoint + 'trips')
    .then(response => response.json())
    .then(data => {
      let trips = data.trips.map(trip => {
        let destination = destinations.find(destination => {
          return destination.id === trip.destinationID
        });
        if (destination) {
          let tripDestination = new Destination(destination);
          return new Trip(trip, tripDestination);
        }
        return {userID: 0};
      });
      fetchUser(id, trips);
    }).catch(error => console.log(error.message));
}

function fetchUser(id, trips) {
  fetch(travelersEndPoint + id)
    .then(response => response.json())
    .then(data => {
      DOMUpdate.user = data.travelers ?
        new Agent(trips) :
        new Traveler(data, trips);
      DOMUpdate.closeLogIn();
      DOMUpdate.user instanceof Agent ?
        DOMUpdate.loadAgentDashboard(buttonHandler) :
        DOMUpdate.loadTravelerDashboard(validateTripRequest);
    }).catch(error => console.log(error.message));
}

function validateTripRequest() {
  if (validateFormFilled()) {
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
  fetch(tripsEndPoint + 'trips', {
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
    id,
    userID,
    destinationID,
    travelers,
    date,
    duration,
    status: "pending",
    suggestedActivities: []
  };
}

function buttonHandler(event) {
  if (event.target.classList.contains('approve-button')) {
    $(event.target).attr('disabled', true);
    approveTrip(event);
  } if (event.target.classList.contains('deny-button')) {
    $(event.target).attr('disabled', true);
    deleteTrip(event);
  } if (event.target.classList.contains('search-button')) {
    $(event.target).attr('disabled', true);
    searchUsers(event);
  }
}

function approveTrip(event) {
  let tripId = Number(event.target.closest('.trip-summary').id);
  fetch(tripsEndPoint + 'updateTrip', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      id: tripId,
      status: 'approved'
    })
  })
    .then(response => response.json())
    .then(data => {
      if (data.message.includes('modified')) {
        DOMUpdate.user.approveTrip(tripId);
        DOMUpdate.handleTripApproval(event);
      } else {
        alert(data.message);
        $(event.target).attr('disabled', false);
      }
    }).catch(error => console.log(error.message));
}

function deleteTrip(event) {
  let tripId = Number(event.target.closest('.trip-summary').id);
  fetch(tripsEndPoint + 'trips', {
    method: 'DELETE',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      id: tripId
    })
  })
    .then(response => response.json())
    .then(data => {
      if (data.message.includes('deleted')) {
        DOMUpdate.user.removeTrip(tripId);
        event.target.closest('.trip-summary').remove();
      } else {
        alert(data.message);
        $(event.target).attr('disabled', false);
      }
    }).catch(error => console.log(error.message));
}

function searchUsers(event) {
  let user = $('#search-input').val();
  let userId = Number($(`#traveler-names option[value='${user}']`).attr('data-id'));
  fetch(destinationsEndPoint)
    .then(response => response.json())
    .then(data => {
      let destinations = data.destinations;
      fetch(tripsEndPoint + 'trips')
        .then(response => response.json())
        .then(data => {
          let trips = data.trips.map(trip => {
            let destination = destinations.find(destination => {
              return destination.id === trip.destinationID
            });
            let tripDestination = new Destination(destination);
            return new Trip(trip, tripDestination);
          });
          fetch(travelersEndPoint + userId)
            .then(response => response.json())
            .then(data => {
              let traveler = new Traveler(data, trips);
              DOMUpdate.loadSearchedTraveler(traveler);
              $(event.target).attr('disabled', false);
            }).catch(error => console.log(error.message));
        }).catch(error => console.log(error.message));
    }).catch(error => console.log(error.message));
}
