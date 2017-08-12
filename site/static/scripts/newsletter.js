import * as mdc from 'material-components-web/dist/material-components-web';
import axios from 'axios';

import backend from './backend';

const subscribeButton = document.querySelector('.newsletter__subscribe-button');

if (subscribeButton) {
  const snackbar = new mdc.snackbar.MDCSnackbar(document.querySelector('.plain-snackbar'));

  subscribeButton.addEventListener('click', evt => {
    backend.subscribe()
      .then(_ => snackbar.show({
        message: 'You successfully subscribed. See you soon!'
      }))
      .catch(_ => snackbar.show({
        message: 'Oh snap! Something went wrong.'
      }));
  });
}
