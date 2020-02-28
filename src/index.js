import $ from 'jquery';
import './css/base.scss';
import './images/turing-logo.png';
import './images/travel-icon.svg';
import './images/log-in-icon.svg';

import DOMUpdate from './domUpdates.js';

let user;
let travelersEndPoint = 'https://fe-apps.herokuapp.com/api/v1/travel-tracker/1911/travelers/travelers/';

DOMUpdate.generateLogIn(logIn);

function logIn() {
  if (validateLogIn()) {
    alert('Log in clicked');
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
  // if (username === 'agency') {
  //   return 'agent';
  // }
  return username === 'agency' || userId;
}
