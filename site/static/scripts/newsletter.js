import backend from './backend';
import dialog from './dialog';

$(document).ready(() => {
  const $subscribeButton = $('.newsletter__subscribe-button');
  if ($subscribeButton) {
    $subscribeButton.on('click', () => {
      backend.subscribe()
        .then(googleUser => {
          const profile = googleUser.getBasicProfile();
          dialog.show('You have subscribed!', `See you soon, ${profile.getGivenName()}!`);
        })
        .catch(error => {
          dialog.show('Oh no!', 'Something bad happened.');
        });
    });
  }
});
