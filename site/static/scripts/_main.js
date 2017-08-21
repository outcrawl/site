import 'material-design-lite';
import Clipboard from 'clipboard';

import backend from './backend';
import dialog from './dialog';
import newsletter from './newsletter';
import search from './search';
import './thread';
import progressive from './progressive';

progressive.init();

$(document).ready(() => {
  dialog.init();
  newsletter.init();

  try {
    backend.init();
  } catch(e) {
    console.log(e);
  }

  // Register clipboard
  new Clipboard('.icon-button[data-clipboard-text]');
});
