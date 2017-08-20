import backend from './backend';
import dialog from './dialog';
import threadDom from './thread-dom';
import 'textarea-autosize';

const $threadCommentsElement = $('.thread__comments');
const $signInButton = $('.thread__sign-in-button');
const $signOutButton = $('.thread__sign-out-button');
const $signedInElement = $('.thread__signed-in');
const $signedOutElement = $('.thread__signed-out');
const $userNameElement = $('.thread__user__name');
const $userAvatarElement = $('.thread__user__avatar');
const $threadPostButton = $('.thread__post-button');
const $threadInput = $('.thread__form__input');
const $previewButton = $('#thread-preview-button');
const $previewElement = $('#thread-panel-preview');

(function() {
  if (postSlug) {
    backend.addOnInitListener(user => {
      userChanged();
    });

    $signInButton.on('click', onSignInClick);
    $signOutButton.on('click', onSignOutClick);
    $threadPostButton.on('click', onPostClick);
    $previewButton.on('click', onPreviewClick);

    $threadInput.textareaAutoSize();
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
  if (!backend.user) {
    return;
  }

  const text = $threadInput.val().trim();
  if (text.length == 0) {
    return;
  }

  backend.createComment(postSlug, text)
    .then(comment => {
      // insert new comment into thread
      comment.user = {
        displayName: backend.user.displayName,
        createdAt: new Date(comment.createdAt),
        imageUrl: backend.user.imageUrl
      };
      $threadCommentsElement.prepend(
        threadDom.buildComment(comment, backend.user)
      );
      $threadCommentsElement.find('.mdl-js-button, .mdl-js-textfield').each((i, e) => {
        componentHandler.upgradeElement(e);
      });

      // reset form input
      $threadInput.val('').trigger('input').trigger('keyup');
    }).catch(error => {
      dialog.show('Oh no!', 'Something went wrong.');
    });
}

function buildThread(thread) {
  // build DOM
  threadDom.build($threadCommentsElement, thread, backend.user);

  // upgrade MDL components
  $threadCommentsElement.find('.mdl-js-button, .mdl-js-textfield').each((i, e) => {
    componentHandler.upgradeElement(e);
  });

  // register listeners
  $threadCommentsElement.children('.comment').on('click', evt => {
    const $target = $(evt.target);

    const callCommentHandler = handler => {
      evt.preventDefault();
      evt.stopPropagation();
      const $commentElement = $target.parent().closest('.comment');
      const id = $target.attr('data-comment-id');

      handler($commentElement, id);
    };

    if ($target.hasClass('comment__action--delete')) {
      callCommentHandler(onDeleteCommentClick);
    } else if ($target.hasClass('comment__action--reply')) {
      callCommentHandler(onReplyClick);
    }
  });
}

function onPreviewClick() {
  const text = $threadInput.val().trim();
  if (text.length == 0) {
    $previewElement.text('Nothing to preview');
  } else {
    try {
      $previewElement.html(threadDom.parseMarkdown(text));
    } catch (e) {
      $previewElement.text('Incorrect LaTeX code');
    }
  }
}

function userChanged() {
  const user = backend.user;
  if (user) {
    $userNameElement.text(user.displayName);
    $userAvatarElement.attr('src', user.imageUrl);

    $signedInElement.show();
    $signedOutElement.hide();
  } else {
    $signedInElement.hide();
    $signedOutElement.show();
  }

  backend.getThread(postSlug)
    .then(buildThread)
    .catch(error => console.log(error));
}

function onDeleteCommentClick($commentElement, commentId) {
  if (!backend.user) {
    return;
  }

  backend.deleteComment(postSlug, commentId)
    .then(() => {
      $commentElement.remove();
    })
    .catch(() => {
      dialog.show('Oh no!', 'Could not delete this comment.');
    });
}

function onReplyClick($commentElement, commentId) {
  const $replyForm = $commentElement.find('.comment__reply');
  const $replyCancelButton = $replyForm.find('.comment__reply__action--cancel');
  const $replyPostButton = $replyForm.find('.comment__reply__action--post');
  const $replyInput = $replyForm.find('.comment__reply__input');

  $replyForm.css('display', 'flex');

  $replyCancelButton.on('click.cancelReply', evt => {
    evt.preventDefault();
    evt.stopPropagation();
    $replyCancelButton.off('click.cancelReply');
    $replyPostButton.off('click.postReply');
    $replyForm.hide();
  });

  $replyPostButton.on('click.postReply', evt => {
    evt.preventDefault();
    evt.stopPropagation();

    const text = $replyInput.val().trim();
    if (text.length == 0) {
      return;
    }

    backend.createComment(postSlug, text, commentId)
    .then(comment => {
      console.log(comment);

      $replyInput.val('');
      $replyPostButton.off('click.postReply');
      $replyCancelButton.off('click.cancelReply');
      $replyForm.hide();
    })
    .catch(() => {
      dialog.show('Oh no!', 'Something went wrong.');
    });
  });
}
