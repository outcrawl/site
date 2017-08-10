import * as mdc from 'material-components-web/dist/material-components-web';

const snackbar = new mdc.snackbar.MDCSnackbar(document.querySelector('.plain-snackbar'));
const successMessage = 'You successfully subscribed. See you soon!';
const errorMessage = 'Oh snap! Something went wrong.';

const subscribeButton = document.querySelector('.newsletter__subscribe-button');
const emailInput = document.querySelector('.newsletter__email-input');

let emailValid = false;
subscribeButton.setAttribute('disabled', '');
emailInput.addEventListener('keyup', evt => {
  const valid = emailInput.checkValidity();
  if (valid != emailValid) {
    emailValid = valid;
    if (valid) {
      subscribeButton.removeAttribute('disabled');
    } else {
      subscribeButton.setAttribute('disabled', '');
    }
  }
});

subscribeButton.addEventListener('click', (evt) => {
  const email = emailInput.value;

  snackbar.show({
    message: successMessage
  });
});
