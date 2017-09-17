import axios from 'axios';
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

        axios.post(`${backend.apiUrl}/signin`, null, {
            headers: {
              'Accept': 'application/json',
              'Authorization': token
            }
          })
          .then(result => {
            backend.user = buildUser(result.data, googleUser);
            localStorage.setItem('user', JSON.stringify(backend.user));
            resolve(backend.user);
          })
          .catch(error => {
            backend.googleAuth.signOut();
            reject(error);
          });
      }
    }, reject);
  });
};

backend.signOut = () => {
  localStorage.removeItem('user');
  backend.user = null;
  backend.googleAuth.signOut();
};

backend.subscribe = (email, reCaptcha) => {
  return new Promise((resolve, reject) => {
    axios.post(`${backend.apiUrl}/mail/subscribe/${email}/${reCaptcha}`, null)
      .then(_ => resolve())
      .catch(reject);
  });
};

backend.getThread = id => {
  return new Promise((resolve, reject) => {
    axios.get(`${backend.apiUrl}/threads/${id}`)
      .then(result => {
        threadBuilder.build(result.data)
          .then(thread => {
            resolve(thread);
          })
          .catch(reject);
      })
      .catch(reject);
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
    axios.post(`${backend.apiUrl}/threads/${threadId}/comments`, comment, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': token
        }
      })
      .then(result => resolve(result.data))
      .catch(reject);
  });
};

backend.deleteComment = (threadId, commentId) => {
  const token = backend.googleAuth.currentUser.get().getAuthResponse().id_token;
  return new Promise((resolve, reject) => {
    axios.delete(`${backend.apiUrl}/threads/${threadId}/comments/${commentId}`, {
        headers: {
          'Authorization': token
        }
      })
      .then(result => resolve(result.data))
      .catch(reject);
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
