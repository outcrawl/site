function buildNewsletterForm() {
  const $newsletterSuccess = $('#newsletter-success');
  const $newsletterError = $('#newsletter-error');

  $('#subscribe-button').click(function () {
    const email = $('#email-input').val();
    const pt = 'tQswM96k127VkJZ88mor2HFLYaDFOgjp';
    const url = 'https://outcrawl-newsletter.appspot.com/subscribe?email=' + email + '&token=' + pt;

    $.post(url)
      .done((data) => {
        $newsletterError.hide();
        $newsletterSuccess.show();
      })
      .fail((xhr, status, error) => {
        $newsletterSuccess.hide();
        $newsletterError.show();
      });
  });
}

function buildSearch() {
  const titles = posts.map(p => p.title);
  const search = Wade(titles);

  const $searchInput = $('#search-input');
  const $dropdown = $('#search-dropdown');

  $searchInput.keyup(e => {
    const query = $searchInput.val().trim();
    const results = search(query);

    $dropdown.html('');
    results.forEach(r => {
      const post = posts[r.index];
      $dropdown.append('<a class="dropdown-item" title="' + post.title + '" href="/' + post.slug + '">' + post.title + '</a>');
    });

    if (results.length === 0) {
      $dropdown.hide();
    } else {
      $dropdown.show();
    }
  });

  $(document).mouseup(e => {
    if(!$dropdown.is(e.target) && $dropdown.has(e.target).length === 0) {
      $dropdown.hide();
    }
  });
}

$(document).ready(function () {
  $('.katex').each((i, obj) => {
    obj.innerHTML = katex.renderToString(obj.innerText);
  });

  buildNewsletterForm();
  buildSearch();
});
