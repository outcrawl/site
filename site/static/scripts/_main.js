import 'material-design-lite';
import Clipboard from 'clipboard';

import backend from './backend';
import dialog from './dialog';
import search from './search';
import './newsletter';
import './thread';
import progressive from './progressive';

$(document).ready(() => {
  progressive.init();
  dialog.init();

  try {
    backend.init();
  } catch(e) {
    console.log(e);
  }

  // Register clipboard
  new Clipboard('button[data-clipboard-text]');
});
