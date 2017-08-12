import * as mdc from 'material-components-web/dist/material-components-web';
import Clipboard from 'clipboard';

import backend from './backend';
import './newsletter';
import './charts';
import './search';

backend.init();

// Init MDC
mdc.autoInit();
for (let e of document.querySelectorAll('.mdc-textfield')) {
  mdc.textfield.MDCTextfield.attachTo(e);
}

// Register clipboard
new Clipboard('.icon-button[data-clipboard-text]');
