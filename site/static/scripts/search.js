import Wade from 'wade';

const titles = posts.map(p => p.title);
const search = Wade(titles);

const $searchResults = $('#search-results');
const $searchInput = $('#search-input');

$searchInput.on('keyup', evt => {
  const query = $searchInput.val();
  const results = search(query);

  $searchResults.empty();

  const queryRegex = new RegExp(`(${query.split(/ +/).join('|')})`, 'gi');
  for (const r of results) {
    const post = posts[r.index];

    const title = post.title.replace(queryRegex, (a, b) => {
      return `<strong>${b}</strong>`;
    });

    $searchResults.append(`
    <a href="${post.slug}">
      ${title}
    </a>
    `);
  }

  if (results.length == 0) {
    $searchResults.hide();
  } else {
    $searchResults.show();
  }
});

// close on unfocus
window.addEventListener('click', evt => {
  if (!$.contains($searchResults.get(), evt.target)) {
    $searchResults.hide();
  }
});
