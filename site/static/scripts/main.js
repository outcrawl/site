const mdc = require('material-components-web/dist/material-components-web');
const Clipboard = require('clipboard');

mdc.autoInit();

let buttons = document.querySelectorAll('.button, .tag');
for (let b of buttons) {
  mdc.ripple.MDCRipple.attachTo(b);
}

new Clipboard('.icon-button[data-clipboard-text]');
