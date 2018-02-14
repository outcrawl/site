import axios from 'axios';

const backend = {
  apiUrl: 'https://outcrawl-backend.appspot.com/api/v1',
};

backend.subscribe = (email, reCaptcha) => {
  return new Promise((resolve, reject) => {
    axios.post(`${backend.apiUrl}/mail/subscribe`, null, {
      params: {
        email: email,
        recaptcha: reCaptcha,
      },
    })
      .then(_ => resolve())
      .catch(reject);
  });
};

export default backend;
