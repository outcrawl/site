import Wade from 'wade';

const titles = posts.map(p => p.title);
const search = Wade(titles);

const searchResults = document.querySelector('#search-results');
const searchInput = document.querySelector('#search-input');

searchInput.addEventListener('keyup', evt => {
  const query = searchInput.value;
  const results = search(query);

  while (searchResults.lastChild) {
    searchResults.removeChild(searchResults.lastChild);
  }

  const queryRegex = new RegExp(`(${query.split(/ +/).join('|')})`, 'gi');
  for (const r of results) {
    const post = posts[r.index];

    const title = post.title.replace(queryRegex, (a, b) => {
      return `<strong>${b}</strong>`;
    });

    searchResults.insertAdjacentHTML('beforeend', `
    <a href="${post.slug}">
      ${title}
    </a>
    `);
  }

  searchResults.style.display = results.length == 0 ? 'none' : '';
});

// close on unfocus
window.addEventListener('click', evt => {
  if (!searchResults.contains(evt.target)) {
    searchResults.style.display = 'none';
  }
});
