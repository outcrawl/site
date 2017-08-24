import 'material-design-lite';
import Clipboard from 'clipboard';

import backend from './backend';
import dialog from './dialog';
import search from './search';
import './newsletter';
import './thread';
import progressive from './progressive';

progressive.init();

$(document).ready(() => {
  dialog.init();

  try {
    backend.init();
  } catch(e) {
    console.log(e);
  }

  // Register clipboard
  new Clipboard('.icon-button[data-clipboard-text]');
});
