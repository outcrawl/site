// const baseUrl = 'https://gqp4quwq1a.execute-api.us-east-1.amazonaws.com/production';
const baseUrl = 'https://x.execute-api.us-east-1.amazonaws.com/production';

function subscribe(email: string, recaptcha: string): Promise<Response> {
  const encodedEmail = encodeURIComponent(email);
  const url = `${baseUrl}/newsletter-subscribe?email=${encodedEmail}&recaptcha=${recaptcha}`;
  return fetch(url, { method: 'POST' });
}

export const newsletterApi = { subscribe };
