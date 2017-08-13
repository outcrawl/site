import axios from 'axios';
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
      axios.get(`https://www.googleapis.com/plus/v1/people/${id}?key=${backend.config.apiKey}`)
      .then(result => {
        users.set(id, result.data);
        n++;

        if (n === users.size) {
          for (const c of thread.comments) {
            c.user = users.get(c.userId);
          }
          resolve();
        }
      })
      .catch(reject);
    }
  });
}

threadBuilder.restructureThread = thread => {
  let commentMap = new Map();
  for (const c of thread.comments) {
    c.replies = [];
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
    list.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    for (const single of list) {
      if (single.replies) {
        sortComments(single.replies);
      }
    }
  };
  sortComments(thread.comments);
}

export default threadBuilder;
