import axios from 'axios';
import threadBuilder from './thread-builder';

const backend = {
  apiUrl: 'https://outcrawl-backend.appspot.com/api',
  user: null,
  config: {
    apiKey: 'AIzaSyC0sNooAxM1he2YgwGxTab6ZKxtQpetqSo',
    authDomain: 'outcrawl-backend.firebaseapp.com',
    databaseURL: 'https://outcrawl-backend.firebaseio.com',
    projectId: 'outcrawl-backend',
    storageBucket: 'outcrawl-backend.appspot.com',
    messagingSenderId: '251611605216'
  }
};

backend.init = () => {
  firebase.initializeApp(backend.config);
  firebase.auth().onAuthStateChanged(auth => {
    if (auth) {
      backend.user = JSON.parse(localStorage.getItem('user'));
      if (backend.onAuthStateChangedListener) {
        backend.onAuthStateChangedListener(backend.user);
      }
    } else {
      backend.user = null;
      localStorage.removeItem('user');
      if (backend.onAuthStateChangedListener) {
        backend.onAuthStateChangedListener(null);
      }
    }
  });
};

backend.onAuthStateChanged = listener => {
  backend.onAuthStateChangedListener = listener;
};

backend.signIn = () => new Promise((resolve, reject) => {
  firebase.auth()
    .signInWithPopup(new firebase.auth.GoogleAuthProvider())
    .then(authResult => {
      axios.post(`${backend.apiUrl}/users/signin`, null, {
          headers: {
            'Accept': 'application/json',
            'Authorization': authResult.credential.idToken
          }
        })
        .then(result => {
          const user = result.data;
          user.displayName = authResult.user.displayName;
          user.photoURL = authResult.user.photoURL;
          localStorage.setItem('user', JSON.stringify(user));
          backend.user = user;
          resolve(user);
        })
        .catch(reject);
    })
    .catch(reject);
});

backend.signOut = () => firebase.auth().signOut();

// Mail
backend.subscribe = () => new Promise((resolve, reject) => {
  firebase.auth()
    .signInWithPopup(new firebase.auth.GoogleAuthProvider())
    .then(result => {
      axios.post(`${backend.apiUrl}/mail/subscribe`, null, {
          headers: {
            'Accept': 'application/json',
            'Authorization': result.credential.idToken
          }
        })
        .then(_ => resolve(result))
        .catch(reject);
    })
    .catch(reject);
});

// Users
backend.banUser = id => {

};

// Comments
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

backend.createComment = (threadId, comment) => {
  return new Promise((resolve, reject) => {
    return firebase.auth().currentUser.getIdToken()
      .then(token => axios.post(`${backend.apiUrl}/threads/${threadId}/comments`,
          comment, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': token
            }
          })
        .then(result => resolve(result.data))
        .catch(reject)
      )
      .catch(reject);
  });
};

export default backend;
