import axios from 'axios';

class NewsletterApi {
  private static url = 'https://outcrawl-backend.appspot.com/api/v1';

  public subscribe(email: string, reCaptcha: string): Promise<{}> {
    return new Promise((resolve, reject) => {
      axios.post(`${NewsletterApi.url}/mail/subscribe`, null, {
        params: {
          email: email,
          recaptcha: reCaptcha,
        },
      }).then(() => resolve())
        .catch(reject);
    });
  }
}

export default NewsletterApi;
