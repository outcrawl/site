import * as mdc from 'material-components-web/dist/material-components-web';
import axios from 'axios';

import backend from './backend';

const subscribeButton = document.querySelector('.newsletter__subscribe-button');
const dialog = new mdc.dialog.MDCDialog(document.querySelector('#basic-dialog'));
const dialogLabel = document.querySelector('#basic-dialog-label');
const dialogDescription = document.querySelector('#basic-dialog-description');

if (subscribeButton) {
  subscribeButton.addEventListener('click', evt => {
    backend.subscribe()
      .then(data => {
        const name = data.user.displayName.split(/ +/)[0];
        dialogLabel.innerText = 'You have subscribed!';
        dialogDescription.innerText = `See you soon, ${name}!`;
        dialog.show();
      })
      .catch(error => {
        console.log(error);
        dialogLabel.innerText = 'Oh no!';
        dialogDescription.innerText = 'Something bad happened.';
        dialog.show();
      });
  });
}
