import axios from 'axios';
import backend from './backend';
import marked from 'marked';

const threadBuilder = {};

threadBuilder.build = thread => {
  const markedRenderer = new marked.Renderer();
  markedRenderer.code = (code, lang) => {
    lang = lang || '';
    return `<pre><code class="language-${lang}">${code}</code></pre>`;
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

  return new Promise((resolve, reject) => {
    threadBuilder.fetchUsers(thread)
      .then(() => {
        threadBuilder.restructureThread(thread);
        resolve(thread);
      })
      .catch(reject);
  });
}

threadBuilder.fetchUsers = thread => {
  const users = new Map();
  for (const comment of thread.comments) {
    comment.createdAt = new Date(comment.createdAt);
    users.set(comment.userId, null);
  }

  let n = 0;
  return new Promise((resolve, reject) => {
    if (users.size == 0) {
      resolve();
      return;
    }

    for (let id of users.keys()) {
      axios.get(`https://www.googleapis.com/plus/v1/people/${id}`, {
          params: {
            key: backend.googleApiKey
          }
        })
        .then(result => {
          users.set(id, result.data);
          n++;
          if (n === users.size) {
            for (const c of thread.comments) {
              c.user = users.get(c.userId);
              c.user.imageUrl = c.user.image.url;
            }
            resolve();
          }
        })
        .catch(reject);
    }
  });
}

threadBuilder.restructureThread = thread => {
  const commentMap = new Map();
  for (const c of thread.comments) {
    c.text = c.text.replace('\\n', '\n').replace('\\t', '\t');
    c.html = marked(c.text);
    commentMap.set(c.id, c);
  }

  for (const c of thread.comments) {
    if (c.replyTo) {
      let parent = commentMap.get(c.replyTo);
      if (!parent) {
        commentMap.delete(c.id);
        continue;
      }

      c.replyToName = parent.user.displayName;
      while (parent.replyTo) {
        parent = commentMap.get(parent.replyTo);
      }
      if (parent.replies) {
        parent.replies.push(c);
      } else {
        parent.replies = [c];
      }
    }
  }

  thread.comments = [];
  for (const c of commentMap.values()) {
    if (!c.replyTo) {
      thread.comments.push(c);
    }
  }

  const sortComments = (list, reversed) => {
    list.sort((a, b) => reversed ? a.createdAt.getTime() - b.createdAt.getTime() : b.createdAt.getTime() - a.createdAt.getTime());
    for (const single of list) {
      if (single.replies) {
        sortComments(single.replies, true);
      }
    }
  };
  sortComments(thread.comments);
}

export default threadBuilder;
