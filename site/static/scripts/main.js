const mdc = require('material-components-web/dist/material-components-web');
const Clipboard = require('clipboard');

mdc.autoInit();

new Clipboard('.icon-button[data-clipboard-text]');
