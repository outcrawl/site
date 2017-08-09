const mdc = require('material-components-web/dist/material-components-web');
const Clipboard = require('clipboard');

mdc.autoInit();

let buttons = document.querySelector('.button');
if (buttons) {
  mdc.ripple.MDCRipple.attachTo(buttons);
}

new Clipboard('.icon-button[data-clipboard-text]');
