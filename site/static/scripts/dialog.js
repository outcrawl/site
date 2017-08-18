const dialog = {};

dialog.init = () => {
  dialog.titleElement = document.querySelector('#ok-dialog-title');
  dialog.contentElement = document.querySelector('#ok-dialog-content');
  const dialogElement = document.querySelector("#ok-dialog");

  if (!dialogElement.showModal) {
    dialogPolyfill.registerDialog(dialogElement);
  }

  dialogElement
    .querySelector(".mdl-button")
    .addEventListener("click", () => {
      dialogElement.close();
    });

  dialog.dialogElement = dialogElement;
}

dialog.show = (title, content) => {
  dialog.titleElement.innerText = title;
  dialog.contentElement.innerText = content;
  dialog.dialogElement.showModal();
}

export default dialog;
