import * as mdc from 'material-components-web/dist/material-components-web';

const dialogElement = new mdc.dialog.MDCDialog(document.querySelector('#basic-dialog'));
const labelElement = document.querySelector('#basic-dialog-label');
const descriptionElement = document.querySelector('#basic-dialog-description');

const dialog = {
  show: (label, body) => {
    labelElement.innerText = label;
    descriptionElement.innerText = body;
    dialogElement.show();
  }
};

export default dialog;
