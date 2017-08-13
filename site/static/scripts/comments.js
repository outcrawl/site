import moment from 'moment';
import backend from './backend';
import dialog from './dialog';

const signedInGroup = document.querySelector('.thread .thread__signed-in');
const signedOutGroup = document.querySelector('.thread .thread__signed-out');
const threadElement = document.querySelector('.thread .thread__comments');
const signInButton = document.querySelector('.thread .thread__sign-in-button');
const signOutButton = document.querySelector('.thread .thread__sign-out-button');

if (postSlug) {
  signInButton.addEventListener('click', evt => {
    evt.preventDefault();
    backend.signIn()
      .then(user => {
        setupForms();
      })
      .catch(error => {
        console.log(error);
        dialog.show('Oh no!', 'You were unable to sign in.');
        setupForms();
      });
  });
  signOutButton.addEventListener('click', evt => {
    evt.preventDefault();
    backend.signOut();
    setupForms();
  });

  backend.onAuthStateChanged(user => {
    setupForms();
    backend.getThread(postSlug)
      .then(thread => buildThreadDOM(thread))
      .catch(error => console.log(error));
  });
}

function setupForms() {
  if (backend.user) {
    signedInGroup.style.display = 'block';
    signedOutGroup.style.display = 'none';

    signedInGroup.querySelector('.thread__user__avatar').src = backend.user.photoURL;
    signedInGroup.querySelector('.thread__user__name').innerText = backend.user.displayName;
  } else {
    signedInGroup.style.display = 'none';
    signedOutGroup.style.display = 'block';
  }
}

function clearThreadDOM() {
  while (threadElement.firstChild) {
    threadElement.removeChild(threadElement.firstChild);
  }
}

function buildThreadDOM(thread) {
  clearThreadDOM();

  for (const comment of thread.comments) {
    threadElement.insertAdjacentHTML('beforeend', `
    <div class="comment" id="comment_${comment.id}">
      <img class="comment__user__avatar"
          src="${comment.user.image.url}"></img>
      <div class="comment__body">
        <div class="comment__user">
          <span class="comment__user__name">${comment.user.displayName}</span>
          <span class="comment__date">${moment(comment.createdAt).fromNow()}</span>
        </div>
        <div class="comment__text">
          ${comment.text}
        </div>
        <div class="comment__actions">
          ${buildCommentActionsDOM(comment)}
        </div>
        <div class="comment__reply-form">
          <div class="textfield textfield--multiline">
            <textarea class="textfield__input" rows="4" placeholder="Say something..."></textarea>
          </div>
          <button class="button button--dense button--compact comment__reply__cancel">Cancel</button>
          <button class="button button--dense button--compact comment__reply__post">Post</button>
        </div>
        <div class="comment__replies">
          ${buildCommentRepliesDOM(comment)}
        </div>
      </div>
    </div>
    `);
  }

  registerEventListeners();
}

function buildCommentActionsDOM(comment) {
  if (backend.user) {
    return `
    <a data-reply-to="${comment.id}" href="#" class="link-button comment__action comment__action--reply">Reply</a>
    `;
  } else {
    return '';
  }
}

function buildCommentRepliesDOM(comment) {
  return comment.replies.map(r => `
  <div class="comment comment--reply" id="comment_${r.id}">
    <img class="comment__user__avatar"
        src="${r.user.image.url}"></img>
    <div class="comment__body">
      <div class="comment__user">
        <span class="comment__user__name">${r.user.displayName}</span>
        <span class="comment__date">${moment(r.createdAt).fromNow()}</span>
      </div>
      <div class="comment__text">
        ${r.text}
      </div>
      <div class="comment__actions">
        ${buildCommentActionsDOM(r)}
      </div>
      <div class="comment__reply-form">
        <div class="textfield textfield--multiline">
          <textarea class="textfield__input" rows="4" placeholder="Say something..."></textarea>
        </div>
        <button class="button button--dense button--compact comment__reply__cancel">Cancel</button>
        <button class="button button--dense button--compact comment__reply__post">Post</button>
      </div>
    </div>
  </div>
  `).join('');
}

function onCancelReplyClick(commentElement) {
  const replyForm = commentElement.querySelector('.comment__reply-form');
  replyForm.style.display = 'none';
}

function onPostReplyClick(commentElement) {
  const text = commentElement.querySelector('.comment__reply-form .textfield__input').value;

  const replyForm = commentElement.querySelector('.comment__reply-form');
  replyForm.style.display = 'none';
}

function onReplyClick(commentElement) {
  const replyForm = commentElement.querySelector('.comment__reply-form');
  replyForm.style.display = 'block';
}

function registerEventListeners() {
  const commentElements = threadElement.querySelectorAll('.comment');
  for (const commentElement of commentElements) {
    commentElement.addEventListener('click', evt => {
      if (evt.target.className.indexOf('comment__action--reply') != -1) {
        evt.preventDefault();
        evt.stopPropagation();
        onReplyClick(commentElement);
      } else if(evt.target.className.indexOf('comment__reply__cancel') != -1) {
        evt.preventDefault();
        evt.stopPropagation();
        onCancelReplyClick(commentElement);
      } else if(evt.target.className.indexOf('comment__reply__post') != -1) {
        evt.preventDefault();
        evt.stopPropagation();
        onPostReplyClick(commentElement);
      }
    });
  }
}
