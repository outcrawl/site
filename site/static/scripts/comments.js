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

function createThread(thread) {
  fetchUsers(thread).then(thread => {
    restructureThread(thread);
  });
}

function fetchUsers(thread) {
  let users = new Map();
  thread.comments.forEach(comment => {
    comment.createdAt = new Date(comment.createdAt);
    users.set(comment.userId, null);
  });

  let n = 0;
  return new Promise((resolve, reject) => {
    for (let id of users.keys()) {
      $.get(
        `https://www.googleapis.com/plus/v1/people/${id}?key=AIzaSyBLwfly8SxDusu2z6b_qioVeWF8j21hRIs`
      ).then(data => {
        users.set(id, data);
        n++;

        if (n === users.size) {
          thread.comments.forEach((c, i) => {
            thread.comments[i].user = users.get(c.userId);
          });
          resolve(thread);
        }
      });
    }
  });
}

function restructureThread(thread) {
  console.log(thread);
}

function buildComments() {
  getThread()
    .then(thread => createThread(thread))
    .catch(error => console.log(error));

  $('#signin-button').click(event => {
    event.preventDefault();
    signIn();
  });
}
