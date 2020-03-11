const baseUrl = 'https://gqp4quwq1a.execute-api.us-east-1.amazonaws.com/production';

function subscribe(email: string, recaptcha: string): Promise<{}> {
  const url = `${baseUrl}/newsletter-subscribe?email=${email}&recaptcha=${recaptcha}`;
  return fetch(url, {
    method: 'POST',
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  });
}

const newsletterApi = {
  subscribe,
};

export default newsletterApi;
