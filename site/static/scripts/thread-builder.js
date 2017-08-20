import backend from './backend';

const threadBuilder = {};

threadBuilder.build = thread => {
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
  let users = new Map();
  for (const comment of thread.comments) {
    comment.createdAt = new Date(comment.createdAt);
    users.set(comment.userId, null);
  }

  let n = 0;
  return new Promise((resolve, reject) => {
    for (let id of users.keys()) {
      $.get(`https://www.googleapis.com/plus/v1/people/${id}`, {
        key: backend.googleApiKey
      })
      .done(data => {
        users.set(id, data);
        n++;
        if (n === users.size) {
          for (const c of thread.comments) {
            c.user = users.get(c.userId);
            c.user.imageUrl = c.user.image.url;
          }
          resolve();
        }
      })
      .fail(reject);
    }
  });
}

threadBuilder.restructureThread = thread => {
  let commentMap = new Map();
  for (const c of thread.comments) {
    c.replies = [];
    c.text = c.text.replace('\\n', '\n').replace('\\t', '\t');
    commentMap.set(c.id, c);
  }

  for (const c of thread.comments) {
    if (c.replyTo) {
      let parent = commentMap.get(c.replyTo);
      c.replyToName = parent.user.displayName;
      while (parent.replyTo) {
        parent = commentMap.get(parent.replyTo);
      }
      parent.replies.push(c);
    }
  }

  thread.comments = [];
  for (const c of commentMap.values()) {
    if (!c.replyTo) {
      thread.comments.push(c);
    }
  }

  const sortComments = list => {
    list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    for (const single of list) {
      if (single.replies) {
        sortComments(single.replies);
      }
    }
  };
  sortComments(thread.comments);
}

export default threadBuilder;
