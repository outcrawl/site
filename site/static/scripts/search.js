import Wade from 'wade';

const titles = posts.map(p => p.title);
const search = Wade(titles);

const searchResults = document.querySelector('.header__search-results');
const searchInput = document.querySelector('.header__search-input .textfield__input');

searchInput.addEventListener('keyup', evt => {
  const query = searchInput.value;
  const results = search(query);

  searchResults.innerHTML = '';
  for (const r of results) {
    const post = posts[r.index];
    searchResults.innerHTML += `
    <a href="${post.slug}" class="list__item" title="${post.title}">
      ${post.title}
    </a>
    `;
  }

  searchResults.style.display = results.length == 0 ? 'none' : '';
});

// close on unfocus
window.addEventListener('click', evt => {
  if (!searchResults.contains(evt.target)) {
    searchResults.style.display = 'none';
  }
});
