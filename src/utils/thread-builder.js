import axios from 'axios';
import backend from './backend';
import marked from 'marked';

const threadBuilder = {};

threadBuilder.init = () => {
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
    sanitize: false,
    smartLists: true,
    smartypants: false,
    renderer: markedRenderer
  });
};

threadBuilder.build = thread => {
  return new Promise((resolve, reject) => {
    threadBuilder.fetchUsers(thread)
      .then(() => {
        threadBuilder.restructureThread(thread);
        resolve(thread);
      })
      .catch(reject);
  });
};

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
  const commentMap = {};
  for (const c of thread.comments) {
    c.text = c.text.replace('\\n', '\n').replace('\\t', '\t');
    c.html = threadBuilder.parseContent(c.text);
    c.replies = [];
    commentMap[c.id] = c;
  }

  for (const c of thread.comments) {
    if (c.replyTo) {
      let parent = commentMap[c.replyTo];
      if (!parent) {
        delete commentMap[c.id];
        continue;
      }

      c.replyToName = parent.user.displayName;
      while (parent.replyTo) {
        parent = commentMap[parent.replyTo];
      }
      parent.replies.push(c);
    }
  }

  thread.comments = [];
  for (const id of Object.keys(commentMap)) {
    const c = commentMap[id];
    if (!c.replyTo) {
      thread.comments.push(c);
    }
  }

  const sortComments = (list, reversed) => {
    list.sort((a, b) => reversed ? a.createdAt.getTime() - b.createdAt.getTime() : b.createdAt.getTime() - a.createdAt.getTime());
    for (const single of list) {
      if (single.replies.length != 0) {
        sortComments(single.replies, true);
      }
    }
  };
  sortComments(thread.comments);
}

threadBuilder.parseContent = source => {
  const text = source
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
  return marked(text);
};

export default threadBuilder;
