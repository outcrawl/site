import * as mdc from 'material-components-web/dist/material-components-web';
import Clipboard from 'clipboard';

import backend from './backend';
import './newsletter';
import './charts';
import './search';

// Init MDC
mdc.autoInit();

// Register clipboard
new Clipboard('.icon-button[data-clipboard-text]');

backend.init();
