import $ from 'jquery';

const DOMUpdate = {
  generateLogIn(callBack) {
    let logInHTML = `<form class="log-in-form">
      <h2>Welcome!</h2>
      <input id="username-input" type="text" placeholder="Your username here"/>
      <input id="password-input" type="password" placeholder="Your password here"/>
      <button id="log-in-button" type="button">
        Log in
        <img src="./images/log-in-icon.svg" class="log-in-icon" alt="log in by Adrien Coquet from the Noun Project"/>
      </button>
    </form>`;
    $('main').append(logInHTML);
    $('#log-in-button').click(callBack);
  }
}

export default DOMUpdate
