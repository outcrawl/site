let user = null;

function getThread() {
  return httpGet(`${commentsApiUrl}/threads/${threadId}`, null);
}

function signIn() {
  return new Promise((resolve, reject) => {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .then(result => {
        httpGet(
          `${commentsApiUrl}/signin`,
          result.credential.idToken,
          data => resolve(data),
          error => reject(error),
        );
      }).catch(reject);
  });
}

function buildThread(thread) {
  fetchUsers(thread).then(thread => {
    restructureThread(thread);
    buildThreadDOM(thread);
  });
}

function fetchUsers(thread) {
  let users = new Map();
  for (const comment of thread.comments) {
    comment.createdAt = new Date(comment.createdAt);
    users.set(comment.userId, null);
  }

  let n = 0;
  return new Promise((resolve, reject) => {
    for (let id of users.keys()) {
      $.get(
        `https://www.googleapis.com/plus/v1/people/${id}?key=AIzaSyBLwfly8SxDusu2z6b_qioVeWF8j21hRIs`
      ).then(data => {
        users.set(id, data);
        n++;

        if (n === users.size) {
          for (const c of thread.comments) {
            c.user = users.get(c.userId);
            //thread.comments[i].user = users.get(thread.userId);
          }
          resolve(thread);
        }
      });
    }
  });
}

function restructureThread(thread) {
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

function buildThreadDOM(thread) {
  const commentTemplate = `
  <div class="media">
    <img class="d-flex mr-3" src="{{userImage}}">
    <div class="media-body">
      <div>
        <strong class="mt-0">{{userName}}</strong>
        <span class="text-muted">{{date}}</span>
      </div>
      {{text}}
      {{replies}}
    </div>
  </div>
  `;
  const replyTemplate = `
  <div class="media mt-3">
    <img class="d-flex pr-3" src="{{userImage}}">
    <div class="media-body">
      <div>
        <strong class="mt-0">{{userName}}</strong>
        <span class="text-muted">{{date}}</span>
      </div>
      <span>{{replyTo}}</span> {{text}}
    </div>
  </div>
  `;

  let dom = '';
  for (const c of thread.comments) {
    let repliesDOM = '';
    for (const r of c.replies) {
      repliesDOM += replyTemplate
      .replace('{{userName}}', r.user.displayName)
      .replace('{{userImage}}', r.user.image.url)
      .replace('{{date}}', moment(r.createdAt).format('MMMM Do YYYY [at] h:mm:ss a'))
      .replace('{{replyTo}}', r.replyToName)
      .replace('{{text}}', r.text)
    }
    dom += commentTemplate
      .replace('{{userName}}', c.user.displayName)
      .replace('{{userImage}}', c.user.image.url)
      .replace('{{date}}', moment(c.createdAt).format('MMMM Do YYYY [at] h:mm:ss a'))
      .replace('{{text}}', c.text)
      .replace('{{replies}}', repliesDOM);
  }

  $('#comment-list').html(dom);
}

function initComments() {
  getThread()
    .then(thread => buildThread(thread))
    .catch(error => console.log(error));

  $('#signin-button').click(event => {
    event.preventDefault();
    signIn();
  });
}
