import * as mdc from 'material-components-web/dist/material-components-web';
import Clipboard from 'clipboard';
import Chartist from 'chartist';

import './newsletter';

// Init MDC
mdc.autoInit();
for (let e of document.querySelectorAll('.mdc-textfield')) {
  mdc.textfield.MDCTextfield.attachTo(e);
}

// Register clipboard
new Clipboard('.icon-button[data-clipboard-text]');

// Init charts
const chartClasses = {
  'line': Chartist.Line,
  'bar': Chartist.Bar,
  'pie': Chartist.Pie
};

for (let name of Object.keys(chartClasses)) {
  const charts = document.querySelectorAll('.chart--' + name);
  for (let c of charts) {
    let data = eval('(' + c.innerText + ')');
    let options = {
      fullWidth: true,
    };

    options.high = data.high;
    options.low = data.low;
    options.showArea = data.showArea || false;
    options.showLine = data.showLine || true;
    options.showPoint = data.showPoint || true;
    options.stackBars = data.stackBars || false;
    options.reverseData = data.reverseData || false;
    options.horizontalBars = data.horizontalBars || false;
    options.distributeSeries = data.distributeSeries || false;
    options.showLabel = data.showLabel || true;

    c.innerText = '';
    new chartClasses[name](c, data, options);
  }
}
