import marked from 'marked';
import timeago from 'timeago.js';

const markedRenderer = new marked.Renderer();
markedRenderer.code = (code, lang) => {
  lang = lang || '';
  return `
  <pre><code class="language-${lang}">${code}</code></pre>
  `;
};
markedRenderer.heading = (text, level, raw) => {
  switch (level) {
    case 1:
      return `<h4>${text}</h4>`;
    case 2:
      return `<h5>${text}</h5>`;
    case 3:
      return `<h6>${text}</h6>`;
    default:
      return `<h6>${text}</h6>`;
  }
};

const threadDom = {};

threadDom.build = ($element, thread, user) => {
  marked.setOptions({
    gfm: true,
    tables: false,
    breaks: false,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false,
    renderer: markedRenderer
  });

  $element.empty();
  for (const comment of thread.comments) {
    $element.append(threadDom.buildComment(comment, user));
  }
};

threadDom.buildComment = (comment, user) => {
  return `
  <div class="comment" id="comment-${comment.id}">
  <img class="comment__user__avatar"
      src="${comment.user.imageUrl}"></img>
  <div class="comment__body">
    <div class="comment__user">
      <span class="comment__user__name">${comment.user.displayName}</span>
      <span class="comment__date">${formatDate(comment.createdAt)}</span>
    </div>
    <div class="comment__text markdown">
      ${threadDom.parseMarkdown(comment.text)}
    </div>
    <div class="comment__actions">
      ${buildCommentActions(comment, user)}
    </div>
    ${buildReplyForm(comment)}
    ${buildReplies(comment, user)}
  </div>
  </div>
  `;
}

function buildCommentActions(comment, user) {
  if (user) {
    if (user.admin) {
      return `
      <a href="#" data-comment-id="${comment.id}" class="comment__action comment__action--reply">
        Reply
      </a>
      <a href="#" data-comment-id="${comment.id}" class="comment__action comment__action--delete">
        Delete
      </a>
      <a href="#" data-user-id="${comment.id}" class="comment__action comment__action--ban">
        Ban user
      </a>
      `;
    } else {
      return `
      <a href="#" data-comment-id="${comment.id}" class="comment__action comment__action--reply">
        Reply
      </a>
      `;
    }
  } else {
    return '';
  }
}

function buildReplies(comment, user) {
  if (!comment.replies) {
    return '';
  }
  return `
  <div class="comment__replies">
  ${comment.replies
    .map(r => `
  <div class="comment comment--reply">
    <img class="comment__user__avatar"
        src="${r.user.imageUrl}"></img>
    <div class="comment__body">
      <div class="comment__meta">
        <span class="comment__user__name">${r.user.displayName}</span>
        <span class="comment__reply-to">${r.replyToName}</span>
        <span class="comment__date">${formatDate(r.createdAt)}</span>
      </div>
      <div class="comment__text markdown">
        ${threadDom.parseMarkdown(r.text)}
      </div>
      <div class="comment__actions">
        ${buildCommentActions(r, user)}
      </div>
      ${buildReplyForm(r)}
    </div>
  </div>
  `).join('')}
  </div>
  `;
}

function buildReplyForm(comment) {
  return `
  <div class="comment__reply">
    <div class="mdl-textfield mdl-js-textfield comment__reply__textfield">
      <label class="mdl-textfield__label" for="comment-reply-input-${comment.id}">
        Add a public reply...
      </label>
      <textarea class="mdl-textfield__input comment__reply__input" id="comment-reply-input-${comment.id}" type="text"></textarea>
    </div>
    <div class="comment__reply__actions">
      <button class="mdl-button mdl-js-button mdl-js-ripple-effect comment__reply__action comment__reply__action--cancel">
        Cancel
      </button>
      <button class="mdl-button mdl-js-button mdl-button--unelevated mdl-button--colored mdl-js-ripple-effect comment__reply__action comment__reply__action--post">
        Post
      </button>
    </div>
  </div>
  `;
}

function formatDate(date) {
  return timeago().format(date);
}

threadDom.parseMarkdown = source => {
  return marked(source);
}

export default threadDom;
