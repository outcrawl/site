import moment from 'moment';
import backend from './backend';

const threadElement = document.querySelector('.thread__comments');
const signInButton = document.querySelector('.thread__sign-in-button');
const signOutButton = document.querySelector('.thread__sign-out-button');

if (postSlug) {
  backend.getThread(postSlug)
  .then(thread => buildThreadDOM(thread))
  .catch(error => console.log(error));
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
      <img class="comment__avatar"
          src="${comment.user.image.url}"></img>
      <div class="comment__body">
        <div class="comment__author">
          <span class="comment__author-name">${comment.user.displayName}</span>
          <span class="comment__date">${moment(comment.createdAt).fromNow()}</span>
        </div>
        <div class="comment__text">
          ${comment.text}
        </div>
        <div class="comment__actions">
          <a data-reply-to="${comment.id}" href="#" class="link-button comment__action comment__action--reply">Reply</a>
        </div>
        <div class="comment__reply-form">
          <div class="textfield textfield--multiline">
            <textarea class="textfield__input" rows="4" placeholder="Say something..."></textarea>
          </div>
          <button class="button comment__reply__cancel">Cancel</button>
          <button class="button comment__reply__post">Post</button>
        </div>
      </div>
    </div>
    `);
  }

  registerEventListeners();
}

function onCancelReplyClick(element) {
  element.parentElement.style.display = 'none';
}

function onPostReplyClick(element) {
  element.parentElement.style.display = 'none';
}

function onReplyClick(element) {
  const parentId = element.dataset.replyTo;
  const commentElement = document.getElementById('comment_' + parentId);
  const replyForm = commentElement.getElementsByClassName('comment__reply-form')[0];

  replyForm.style.display = 'block';

  const cancelButton = replyForm.getElementsByClassName('comment__reply__cancel')[0];
  const postButton = replyForm.getElementsByClassName('comment__reply__post')[0];
  cancelButton.addEventListener('click', evt => {
    evt.preventDefault();
    onCancelReplyClick(evt.target);
  });
  postButton.addEventListener('click', evt => {
    evt.preventDefault();
    onPostReplyClick(evt.target);
  });
}

function registerEventListeners() {
  let buttons = document.querySelectorAll('.comment__action--reply');
  for (const b of buttons) {
    b.addEventListener('click', evt => {
      evt.preventDefault();
      onReplyClick(evt.target);
    });
  }
}
