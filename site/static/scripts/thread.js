import backend from './backend';
import dialog from './dialog';
import 'textarea-autosize';
import threadDom from './thread-dom';

const $threadComments = $('.thread__comments');
const $signInButton = $('.thread__sign-in-button');
const $signOutButton = $('.thread__sign-out-button');
const $signedInPanel = $('.thread__signed-in');
const $signedOutPanel = $('.thread__signed-out');
const $userName = $('.thread__user__name');
const $userAvatar = $('.thread__user__avatar');
const $threadPostButton = $('.thread__post-button');
const $threadInput = $('.thread__form__input');
const $previewButton = $('#thread-preview-button');
const $previewPanel = $('#thread-panel-preview');

let thread = null;

(function() {
  if (postSlug) {
    backend.addOnInitListener(user => {
      userChanged();
    });

    const $layout = $('.mdl-layout');
    const $window = $(window);
    const $target = $('.thread__title');
    $layout.on('scroll', () => {
      const ty = $target.offset().top;
      if (ty < $window.height()) {
        backend.getThread(postSlug)
        .then(data => {
          thread = data;
          buildThread();
          hideLoading();
        })
        .catch(error => {
          console.log(error);
          $threadComments.remove();
          $('.thread__loading-error').show();
          hideLoading();
        });
        $layout.off('scroll');
      }
    });

    $signInButton.on('click', onSignInClick);
    $signOutButton.on('click', onSignOutClick);
    $threadPostButton.on('click', onPostClick);
    $previewButton.on('click', onPreviewClick);

    $threadInput.textareaAutoSize();
  }
})();

function hideLoading() {
  const $loading = $('.thread__loading');
  $loading.remove();
}

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
  backend.signOut();
  userChanged();
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
      comment.createdAt = new Date(comment.createdAt);
      comment.user = {
        displayName: backend.user.displayName,
        imageUrl: backend.user.imageUrl
      };

      thread.comments.unshift(comment);
      buildThread();

      // reset form input
      $threadInput.val('').trigger('input').trigger('keyup');
    }).catch(error => {
      dialog.show('Oh no!', 'Something went wrong.');
    });
}

function buildThread() {
  // build DOM
  threadDom.build($threadComments, thread, backend.user);

  // upgrade MDL components
  $threadComments.find('.mdl-js-button, .mdl-js-textfield').each((i, e) => {
    componentHandler.upgradeElement(e);
  });

  // register listeners
  $threadComments.children('.comment').on('click', evt => {
    const $target = $(evt.target);

    const callCommentHandler = handler => {
      evt.preventDefault();
      evt.stopPropagation();
      const $commentElement = $target.parent().parent().parent();
      const id = $commentElement.attr('data-id');

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
    $previewPanel.text('Nothing to preview');
  } else {
    try {
      $previewPanel.html(threadDom.parseMarkdown(text));
    } catch (e) {
      $previewPanel.text('Incorrect LaTeX code');
    }
  }
}

function userChanged() {
  const user = backend.user;
  if (user) {
    $userName.text(user.displayName);
    $userAvatar.attr('src', user.imageUrl);

    $signedInPanel.show();
    $signedOutPanel.hide();
  } else {
    $signedInPanel.hide();
    $signedOutPanel.css('display', 'flex');
  }
}

function onDeleteCommentClick($commentElement, commentId) {
  if (!backend.user || !backend.user.admin) {
    return;
  }

  if (!confirm('Are you sure?')) {
    return;
  }

  backend.deleteComment(postSlug, commentId)
    .then(() => {
      thread.comments = thread.comments.filter(c => c.id != commentId);
      for (const c of thread.comments) {
        if (c.replies) {
          c.replies = c.replies.filter(rc => rc.id != commentId);
        }
      }
      $commentElement.remove();
    })
    .catch(() => {
      dialog.show('Oh no!', 'Could not delete this comment.');
    });
}

function onReplyClick($commentElement, commentId) {
  const $replyForm = $commentElement.find('.comment__reply:first');
  const $replyCancelButton = $replyForm.find('.comment__reply__action--cancel:first');
  const $replyPostButton = $replyForm.find('.comment__reply__action--post:first');
  const $replyInput = $replyForm.find('.comment__reply__input:first');

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
        comment.createdAt = new Date(comment.createdAt);
        comment.user = {
          displayName: backend.user.displayName,
          imageUrl: backend.user.imageUrl
        };

        // get original comment
        let parent = thread.comments.find(c => c.id == commentId);
        if (!parent) {
          for (const c of thread.comments) {
            if (c.replies) {
              parent = c.replies.find(r => r.id == commentId);
              if (parent) {
                break;
              }
            }
          }
        }
        comment.replyToName = parent.user.displayName;

        if (parent.replyTo) {
          parent = thread.comments.find(c => c.replies && c.replies.find(r => r.id = parent.id) != null);
        }
        if (parent.replies) {
          parent.replies.push(comment);
        } else {
          parent.replies = [comment];
        }

        buildThread();
      })
      .catch(error => {
        console.log(error);
        dialog.show('Oh no!', 'Something went wrong.');
      });
  });
}
