import 'material-design-lite';

import Clipboard from 'clipboard';

import backend from './backend';
import dialog from './dialog';
import newsletter from './newsletter';
import search from './search';
import './thread';

(function() {
  dialog.init();
  newsletter.init();
  backend.init();

  // Register clipboard
  new Clipboard('.icon-button[data-clipboard-text]');
})();
