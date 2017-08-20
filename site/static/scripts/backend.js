import threadBuilder from './thread-builder';

const backend = {
  apiUrl: 'https://outcrawl-backend.appspot.com/api',
  googleApiKey: 'AIzaSyDlfCuIC0UecGQG8cHsoMHr8VQXy5uUFJU',
  googleClientId: '251611605216-g4e7n0b2i5abh9nn02rp46f79aqkublg.apps.googleusercontent.com',
  onInitListeners: []
};

backend.init = () => {
  gapi.load('client:auth2', () => {
    gapi.client.init({
      'apiKey': backend.googleApiKey,
      'clientId': backend.googleClientId,
      'scope': 'profile email'
    }).then(() => {
      backend.googleAuth = gapi.auth2.getAuthInstance();

      const googleUser = backend.googleAuth.currentUser.get();
      if (googleUser) {
        backend.user = JSON.parse(localStorage.getItem('user'));
      }
      for (const listener of backend.onInitListeners) {
        listener(backend.user);
      }
    });
  });
};

backend.addOnInitListener = listener => {
  backend.onInitListeners.push(listener);
};

backend.signIn = () => {
  return new Promise((resolve, reject) => {
    backend.googleAuth.signIn({
      'prompt': 'consent',
    }).then(googleUser => {
      if (googleUser.error) {
        reject(googleUser.error);
      } else {
        const token = googleUser.getAuthResponse().id_token;
        $.ajax(`${backend.apiUrl}/signin`, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Authorization': token
            }
          })
          .then(data => {
            backend.user = buildUser(data, googleUser);
            localStorage.setItem('user', JSON.stringify(backend.user));
            resolve(backend.user);
          })
          .fail(reject);
      }
    }, reject);
  });
};

backend.signOut = () => {
  localStorage.removeItem('user');
  return backend.googleAuth.signOut();
};

backend.getThread = id => {
  return new Promise((resolve, reject) => {
    $.get(`${backend.apiUrl}/threads/${id}`)
      .done(data => {
        threadBuilder.build(data)
          .then(thread => {
            resolve(thread);
          })
          .catch(reject);
      })
      .fail(reject);
  });
};

backend.createComment = (threadId, text, replyTo) => {
  const token = backend.googleAuth.currentUser.get().getAuthResponse().id_token;
  const comment = {
    text: text
  };
  if (replyTo) {
    comment.replyTo = replyTo;
  }
  return new Promise((resolve, reject) => {
    $.ajax(`${backend.apiUrl}/threads/${threadId}/comments`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': token
        },
        data: JSON.stringify(comment)
      })
      .done(resolve)
      .fail(reject);
  });
};

backend.deleteComment = (threadId, commentId) => {
  const token = backend.googleAuth.currentUser.get().getAuthResponse().id_token;
  return new Promise((resolve, reject) => {
    $.ajax(`${backend.apiUrl}/threads/${threadId}/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': token
      }
    })
    .done(resolve)
    .fail(reject);
  });
};

function buildUser(user, googleUser) {
  const profile = googleUser.getBasicProfile();
  user.displayName = profile.getName();
  user.email = profile.getEmail();
  user.givenName = profile.getGivenName();
  user.familyName = profile.getFamilyName();
  user.imageUrl = profile.getImageUrl();
  return user;
}

export default backend;
