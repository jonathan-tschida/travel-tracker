import $ from 'jquery';
import Trip from './Trip.js';
import Destination from './Destination.js';

const DOMUpdate = {
  user: {},
  travelers: [],
  destinations: [],
  selectedDestination: {
    destination: '',
    estimatedLodgingCostPerDay: 0,
    estimatedFlightCostPerPerson: 0
  },
  plannedTrip: {},

  popUpLogIn(callBack) {
    let logInHTML = `<form class="log-in-form">
      <h2>Welcome!</h2>
      <input id="username-input" type="text" placeholder="Your username here"/>
      <input id="password-input" type="password" placeholder="Your password here"/>
      <button id="log-in-button" type="submit" onclick="return false">
        Log in
        <img src="./images/log-in-icon.svg" class="log-in-icon" alt="log in by Adrien Coquet from the Noun Project"/>
      </button>
    </form>`;
    $('main').append(logInHTML);
    $('#log-in-button').click(callBack);
  },

  closeLogIn() {
    $('.log-in-form').remove();
  },

  loadTravelerDashboard(validateTripRequest) {
    this.updateHeader();
    this.loadMyTrips();
    this.loadNewTripForm(validateTripRequest);
  },

  updateHeader() {
    let userNameHTML = `<h2 class="user-name">${this.user.name}</h2>`;
    $('.user-name').remove();
    $('header').append(userNameHTML);
  },

  loadMyTrips() {
    let trips = this.user.trips;
    let myTripsHTML = `<section class="trips">
      <h2>My Trips</h2>
    </section>`;
    let spendingHTML = `<h3 class="spending-summary">Yearly Total<span>${'$' + this.user.calculateYearlyCost()}</span></h3>`;
    $('.trips').remove();
    $('main').append(myTripsHTML);
    trips.forEach(trip => {
      let tripHTML = this.generateTripHTML(trip);
      $('.trips').append(tripHTML);
    });
    $('.trips').append(spendingHTML);
  },

  generateTripHTML(trip) {
    return `<article class="trip-summary" id=${trip.id}>
      <div class="trip-heading">
        <img src="${trip.destination.image}" />
        <div class="destination-summary">
          <h3>${trip.destination.city},</h3>
          <h3>${trip.destination.country}</h3>
          <p>${trip.printDate()}</p>
        </div>
      </div>
      <div class="status-summary">
        <p><span>${trip.travelers}</span> travelers</p>
        <p><span>${trip.duration}</span> days</p>
        <p class="trip-status ${trip.status}">${trip.status}</p>
      </div>
    </article>`;
  },

  loadNewTripForm(validateTripRequest) {
    let formHTML = `<form class="new-trip-form">
      <h2>New Trip</h2>
      <label for="date-input">Start date:</label>
      <input id="date-input" type="date" required />
      <input id="duration-input" type="number" placeholder="Duration of your trip" min=1 step=1 required />
      <input id="destination-input" list="destinations" placeholder="Your destination" required />
        <datalist id="destinations">
        </datalist>
      <input id="travelers-input" type="number" placeholder="Number of travelers" min=1 step= 1 required />
      <h3 class="estimated-cost">Estimated Cost<span>$0.00</span></h3>
      <button id="new-trip-button" type="submit">Submit</button>
    </form>`;
    $('.new-trip-form').remove();
    $('main').append(formHTML);
    this.fetchDestinations();
    $('#date-input').attr('min', new Date().toISOString().slice(0, 10));
    $('.new-trip-form input').on('input', DOMUpdate.updateEstimate.bind(DOMUpdate));
    $('#new-trip-button').click(validateTripRequest);
  },

  fetchDestinations() {
    let destinationsEndPoint = 'https://fe-apps.herokuapp.com/api/v1/travel-tracker/1911/destinations/destinations';
    fetch(destinationsEndPoint)
      .then(response => response.json())
      .then(data => {
        this.destinations = data.destinations;
        data.destinations.forEach(destination => {
          let newOption = `<option value='${destination.destination}' data-id='${destination.id}'/>`;
          $('#destinations').append(newOption);
        })
      }).catch(error => console.log(error.message));
  },

  updateEstimate() {
    let trip = {
      userID: this.user.id,
      destinationID: this.getDestinationID(),
      travelers: $('#travelers-input').val(),
      date: $('#date-input').val(),
      duration: $('#duration-input').val(),
    };
    let match = this.destinations.find(destination => {
      return destination.id === this.getDestinationID();
    }) || {};
    this.selectedDestination = new Destination(match);
    this.plannedTrip = new Trip(trip, this.selectedDestination);
    $('.estimated-cost span').text('$' + this.plannedTrip.estimateCost());
  },

  getDestinationID() {
    let destination = $('#destination-input').val();
    let ID = $(`#destinations option[value='${destination}']`).attr('data-id') || 0;
    return Number(ID);
  },

  loadAgentDashboard(buttonHandler) {
    $('main').click(buttonHandler);
    this.loadTravelerSearch();
    this.loadAgentSummary();
  },

  loadAgentSummary() {
    let summaryHTML = `<section class="agent-summary">
      <h2>Summary</h2>
      <article class="agent-stats">
        <p>${new Date().getFullYear()} Income<span>${'$' + this.user.calculateYearlyIncome()}</span></p>
        <p>Today's Travelers<span>${this.user.getTodaysTravelers()}</span></p>
      </article>
      <h2>Pending Requests</h2>
    </section>`;
    $('.agent-summary').remove();
    $('main').append(summaryHTML);
    this.user.filterTrips('pending').forEach(trip => {
      let tripHTML = this.generateTripHTML(trip);
      $('.agent-summary').append(tripHTML);
    });
    this.addAgentButtons('.agent-summary');
  },

  addAgentButtons(selector) {
    let buttonHTML = `<div class="agent-actions">
      <button class="approve-button">Approve</button>
      <button class="deny-button">Deny / Delete</button>
    </div>`;
    $(`${selector} .trip-summary`).each((index, value) => {
      let matchingCard = $(value).closest('.trip-summary');
      let tripStatus = matchingCard.find('.trip-status').text();
      $(value).append(buttonHTML);
      if (tripStatus === 'approved') {
        $(value).find('.approve-button').remove();
      }
    });
  },

  loadTravelerSearch() {
    let searchHTML = `<section class="traveler-search">
      <h2>Traveler Search</h2>
      <form>
        <input id="search-input" type="search" list="traveler-names" placeholder="Traveler name"/>
          <datalist id="traveler-names">
          </datalist>
        <button class="search-button" type="submit" onclick="return false">Search</button>
      </form>
      <div id="search-results">
      </div>
    </section>`;
    $('main').append(searchHTML);
    this.fetchTravelers();
  },

  fetchTravelers() {
    let travelersEndPoint = 'https://fe-apps.herokuapp.com/api/v1/travel-tracker/1911/travelers/travelers/';
    fetch(travelersEndPoint)
      .then(response => response.json())
      .then(data => {
        this.travelers = data.travelers;
        this.travelers.forEach(traveler => {
          let newOption = `<option value='${traveler.name}' data-id='${traveler.id}'/>`;
          $('#traveler-names').append(newOption);
        })
      }).catch(error => console.log(error));
  },

  handleTripApproval(event) {
    let matchingCard = $(event.target).closest('.trip-summary');
    let tripStatus = matchingCard.find('.trip-status');
    if ($(event.target).parents('.agent-summary').length) {
      $(matchingCard).remove();
    } else {
      $(tripStatus).attr('class', 'approved');
      $(tripStatus).text('approved');
      $(matchingCard).find('.approve-button').remove();
    }
  },

  loadSearchedTraveler(traveler) {
    $('#search-results').empty();
    $('#search-results').append(`<h2 class="searched-name">${traveler.name}</h2>`)
    traveler.trips.forEach(trip => {
      let tripHTML = this.generateTripHTML(trip);
      $('#search-results').append(tripHTML);
    });
    this.addAgentButtons('#search-results');
  }
}

export default DOMUpdate;
