import $ from 'jquery';
import './css/base.scss';
import './images/turing-logo.png';
import './images/travel-icon.svg';
import './images/log-in-icon.svg';
import Agent from './Agent.js';
import Traveler from './Traveler.js';

import DOMUpdate from './domUpdates.js';

let user;
let travelersEndPoint = 'https://fe-apps.herokuapp.com/api/v1/travel-tracker/1911/travelers/travelers/';

DOMUpdate.popUpLogIn(logIn);

function logIn() {
  if (validateLogIn()) {
    let userId = validateUsername();
    DOMUpdate.closeLogIn();
    updateTraveler(userId);
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

function updateTraveler(id) {
  fetch(travelersEndPoint + id)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      user = data.message ?
        new Agent() :
        new Traveler(data);
      console.log(user);
      user instanceof Agent ?
        DOMUpdate.loadAgentDashboard() :
        DOMUpdate.loadTravelerDashboard(user);
    })
    .catch(error => alert(error.message));
}
