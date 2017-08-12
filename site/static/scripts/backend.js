import axios from 'axios';

const backend = {
  apiUrl: 'https://outcrawl-backend.appspot.com/api',
  config: {
    apiKey: 'AIzaSyC0sNooAxM1he2YgwGxTab6ZKxtQpetqSo',
    authDomain: 'outcrawl-backend.firebaseapp.com',
    databaseURL: 'https://outcrawl-backend.firebaseio.com',
    projectId: 'outcrawl-backend',
    storageBucket: 'outcrawl-backend.appspot.com',
    messagingSenderId: '251611605216'
  }
};

backend.init = () => firebase.initializeApp(backend.config);

backend.subscribe = () => new Promise((resolve, reject) => {
  firebase.auth()
    .signInWithPopup(new firebase.auth.GoogleAuthProvider())
    .then(result => {
      const client = axios.create({
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': result.credential.idToken
        }
      });
      client.post(`${backend.apiUrl}/mail/subscribe`)
        .then(resolve)
        .catch(reject);
    })
    .catch(reject);
});

/*
return new Promise((resolve, reject) => {
  firebase.auth()
  .signInWithPopup(new firebase.auth.GoogleAuthProvider())
    .then(result => {
      httpGet(`${commentsApiUrl}/signin`, result.credential.idToken)
        .then(resolve)
        .catch(reject);
    })
    .catch(reject);
});
*/

export default backend;
