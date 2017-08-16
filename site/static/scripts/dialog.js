const dialog = {};

dialog.init = () => {
  dialog.titleElement = document.querySelector('#ok-dialog-title');
  dialog.contentElement = document.querySelector('#ok-dialog-content');
  dialog.backdrop = document.querySelector('dialog-backdrop');
  const dialogElement = document.querySelector("#ok-dialog");

  if (!dialogElement.showModal) {
    dialogPolyfill.registerDialog(dialogElement);
  }

  dialogElement
    .querySelector("button:not([disabled])")
    .addEventListener("click", () => {
      dialogElement.close();
      dialog.backdrop.style.display = 'none';
    });

  dialog.dialogElement = dialogElement;
}

dialog.show = (title, content) => {
  dialog.titleElement.innerText = title;
  dialog.contentElement.innerText = content;
  dialog.dialogElement.showModal();
  dialog.backdrop.style.display = '';
}

export default dialog;
