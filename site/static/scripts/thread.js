import backend from './backend';
import dialog from './dialog';
import threadDom from './thread-dom';

const threadCommentsElement = document.querySelector('.thread__comments');
const signInButton = document.querySelector('.thread__sign-in-button');
const signOutButton = document.querySelector('.thread__sign-out-button');
const signedInElement = document.querySelector('.thread__signed-in');
const signedOutElement = document.querySelector('.thread__signed-out');
const userNameElement = document.querySelector('.thread__user__name');
const userAvatarElement = document.querySelector('.thread__user__avatar');
const threadPostButton = document.querySelector('.thread__post-button');
const threadInput = document.querySelector('.thread__form__input');
const previewButton = document.querySelector('#thread-preview-button');
const previewElement = document.querySelector('#thread-panel-preview');

(function() {
  if (postSlug) {
    backend.addOnInitListener(user => {
      userChanged();
    });

    signInButton.addEventListener('click', onSignInClick);
    signOutButton.addEventListener('click', onSignOutClick);
    threadPostButton.addEventListener('click', onPostClick);
    previewButton.addEventListener('click', onPreviewClick);

    threadInput.addEventListener('input', updateTextareaHeight);
  }
})();

function onSignInClick() {
  backend.signIn()
    .then(_ => userChanged())
    .catch(error => {
      if (error.error != 'popup_closed_by_user') {
        dialog.show('Oh no!', 'You were unable to sign in.');
      }
    });
}

function onSignOutClick() {
  backend.signOut().then(() => userChanged());
}

function onPostClick() {
  if (backend.user) {
    const text = threadInput.value.trim();
    if (text.length == 0) {
      return;
    }

    try {
      threadDom.parseMarkdown(text);
    } catch (e) {
      dialog.show('Oh no!', 'Something is wrong with your LaTeX code.');
      return;
    }

    backend.createComment(postSlug, text)
      .then(result => {
        // insert new comment into thread
        const comment = result.data;
        comment.user = {
          displayName: backend.user.displayName,
          createdAt: new Date(comment.createdAt),
          imageUrl: backend.user.imageUrl
        };
        threadCommentsElement.insertAdjacentHTML(
          'afterbegin',
          threadDom.buildComment(comment, backend.user)
        );

        // reset form input
        threadInput.value = '';
      }).catch(error => {
        dialog.show('Oh no!', 'Something went wrong.');
      });
  }
}

function onPreviewClick() {
  const text = threadInput.value.trim();
  if (text.length == 0) {
    previewElement.innerText = 'Nothing to preview';
  } else {
    try {
      previewElement.innerHTML = threadDom.parseMarkdown(text);
    } catch (e) {
      previewElement.innerText = 'Incorrect LaTeX code';
    }
  }
}

function userChanged() {
  const user = backend.user;
  if (user) {
    userNameElement.innerText = user.displayName;
    userAvatarElement.src = user.imageUrl;

    signedInElement.style.display = 'block';
    signedOutElement.style.display = 'none';
  } else {
    signedInElement.style.display = 'none';
    signedOutElement.style.display = 'block';
  }

  backend.getThread(postSlug)
    .then(thread => {
      threadDom.build(threadCommentsElement, thread, user);
    })
    .catch(error => console.log(error));
}

function updateTextareaHeight() {
  let n = 3;
  const m = threadInput.value.match(/\n/g);
  if (m) {
    n = m.length + 1;
  }
  if (n < 3) {
    n = 3;
  }
  threadInput.setAttribute('rows', n);
}
