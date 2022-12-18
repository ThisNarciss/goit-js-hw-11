import './css/styles.css';
import Notiflix from 'notiflix';
import axios from 'axios';

const API_KEY = '32144711-033503d2fc66376fdc1e9e47c';
const BACKEND_REF = 'https://pixabay.com/api/';

const formRef = document.querySelector('.search-form');
const inputRef = document.querySelector('.search-form input');
const btnRef = document.querySelector('.search-form button');
const galleryRef = document.querySelector('div.gallery');

console.log(formRef);
console.log(inputRef);
console.log(btnRef);
console.log(galleryRef);

formRef.addEventListener('submit', onSubmitSearch);
// inputRef.addEventListener('input', onInputSearchImg);

async function onSubmitSearch(evt) {
  evt.preventDefault();
  const inputVal = evt.currentTarget.elements.searchQuery.value;

  const response = await axios.get('https://pixabay.com/api/', {
    params: {
      key: '32144711-033503d2fc66376fdc1e9e47c',
      q: inputVal,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: 1,
      per_page: 40,
    },
  });

  if (!response.data.total) {
    Notiflix.Notify.info(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  const imgMurkUp = response.data.hits
    .map(img => {
      return `<div class="photo-card">
  <img src=${img.webformatURL} alt=${img.tags} loading="lazy" width="350" height="200"/>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>${img.likes}
    </p>
    <p class="info-item">
      <b>Views</b>${img.views}
    </p>
    <p class="info-item">
      <b>Comments</b>${img.comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${img.downloads}
    </p>
  </div>
</div>`;
    })
    .join('');
  galleryRef.innerHTML = imgMurkUp;
}
