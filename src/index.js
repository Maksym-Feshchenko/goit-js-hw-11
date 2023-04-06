import Notiflix from 'notiflix';
import axios from 'axios';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const button = document.querySelector('.load-more');
const apiKey = '35073531-a3301b6130ef0984d8d454ab2';
let per_page = 40;
let currentPage = 1;

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const searchQuery = event.target.elements.searchQuery.value.trim();
  currentPage = 1;

  try {
    const url = `https://pixabay.com/api/?key=${apiKey}&q=${searchQuery}&image_type=photo&per_page=${per_page}&page=${currentPage}`;
    const response = await axios.get(url);
    const images = response.data.hits;
    const cards = images.map((image) => createCard(image));

    gallery.innerHTML = '';
    gallery.append(...cards);

    if (images.length === 0) {
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.'); 
      button.classList.add('hidden'); 
    } else {
      button.classList.remove('hidden');
    }
  } catch (error) {
    Notiflix.Notify.failure('Oops, something went wrong!');
    button.classList.add('hidden'); 
  }
});

button.addEventListener('click', async () => {
  currentPage++;
  const searchQuery = document.querySelector('#search-form input[name=searchQuery]').value.trim();

  try {
    const url = `https://pixabay.com/api/?key=${apiKey}&q=${searchQuery}&image_type=photo&per_page=${per_page}&page=${currentPage}`;
    const response = await axios.get(url);
    const images = response.data.hits;
    const cards = images.map((image) => createCard(image));

    gallery.append(...cards);

    if (images.length === 0) {
      Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
      button.classList.add('hidden');
    } else {
      button.classList.remove('hidden');
    }

    const { height: cardHeight } = document.querySelector('.gallery').firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  } catch (error) {
    Notiflix.Notify.failure('Oops, something went wrong!');
    button.classList.add('hidden');
  }
});

function createCard(image) {
  const card = document.createElement('div');
  card.classList.add('photo-card');
  
  const img = document.createElement('img');
  img.src = image.webformatURL;
  img.alt = image.tags;
  img.loading = 'lazy';
  
  const info = document.createElement('div');
  info.classList.add('info');
  
  const likes = createInfoItem('Likes', image.likes);
  const views = createInfoItem('Views', image.views);
  const comments = createInfoItem('Comments', image.comments);
  const downloads = createInfoItem('Downloads', image.downloads);
  
  info.append(likes, views, comments, downloads);
  card.append(img, info);
  
  return card;
}

function createInfoItem(label, value) {
  const item = document.createElement('p');
  item.classList.add('info-item');
  
  const bold = document.createElement('b');
  bold.textContent = label;
  
  item.append(bold, `: ${value}`);
  
  return item;
}
