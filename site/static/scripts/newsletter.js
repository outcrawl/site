import * as mdc from 'material-components-web/dist/material-components-web';
import axios from 'axios';

import backend from './backend';
import dialog from './dialog';

const subscribeButton = document.querySelector('.newsletter__subscribe-button');

if (subscribeButton) {
  subscribeButton.addEventListener('click', evt => {
    backend.subscribe()
      .then(data => {
        const name = data.user.displayName.split(/ +/)[0];
        dialog.show('You have subscribed!', `See you soon, ${name}!`);
      })
      .catch(error => {
        dialog.show('Oh no!', 'Something bad happened.');
      });
  });
}
