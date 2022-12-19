import './css/styles.css';
import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const API_KEY = '32144711-033503d2fc66376fdc1e9e47c';
const FETCH_URL = 'https://pixabay.com/api/';

const formRef = document.querySelector('.search-form');
const loadMoreBtn = document.querySelector('.load-more');
const galleryRef = document.querySelector('div.gallery');

let page = 1;
let inputVal = '';

formRef.addEventListener('submit', onSearchSubmit);
loadMoreBtn.addEventListener('click', onLoadMoreClick);
// window.addEventListener('scroll', onLoadMoreScroll);

async function onSearchSubmit(evt) {
  evt.preventDefault();
  galleryRef.innerHTML = '';
  loadMoreBtn.classList.remove('is-seen');
  page = 1;
  inputVal = evt.currentTarget.elements.searchQuery.value;
  try {
    const articles = await fetchArticles(inputVal);

    if (!articles.data.total) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    Notiflix.Notify.success(
      `Hooray! We found ${articles.data.totalHits} images.`
    );

    createMurkUp(articles.data.hits);
    scrollPageDown();
    loadMoreBtn.classList.add('is-seen');
  } catch (error) {}
}

async function onLoadMoreClick() {
  try {
    const articles = await fetchArticles(inputVal);
    createMurkUp(articles.data.hits);
    scrollPageDown();
    const allArticles = document.querySelectorAll('.photo-card');

    if (articles.data.totalHits <= allArticles.length) {
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
      loadMoreBtn.classList.remove('is-seen');
    }
  } catch (error) {}
}

// async function onLoadMoreScroll() {
//   if (
//     window.scrollY + window.innerHeight >=
//     document.documentElement.scrollHeight - 1
//   ) {
//     try {
//       const articles = await fetchArticles(inputVal);
//       createMurkUp(articles.data.hits);
//       scrollPageDown();
//       const allArticles = document.querySelectorAll('.photo-card');
//       console.log(articles);
//       if (articles.data.totalHits <= allArticles.length) {
//         Notiflix.Notify.failure(
//           "We're sorry, but you've reached the end of search results."
//         );
//       }
//     } catch (error) {}
//   }
// }

async function fetchArticles(value) {
  try {
    const response = await axios.get(FETCH_URL, {
      params: {
        key: API_KEY,
        q: value,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page,
        per_page: 40,
      },
    });

    page += 1;
    return response;
  } catch (error) {}
}

function createMurkUp(arr) {
  const imgMurkUp = arr
    .map(img => {
      return `<a href=${img.largeImageURL}><div class="photo-card">
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
</div></a>`;
    })
    .join('');
  galleryRef.insertAdjacentHTML('beforeend', imgMurkUp);
  const carousel = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });
  carousel.on('show.simplelightbox');
  carousel.refresh();
}

function scrollPageDown() {
  const { height: cardHeight } =
    galleryRef.firstElementChild.getBoundingClientRect();

  return window.scrollBy({
    top: cardHeight * 10,
    behavior: 'smooth',
  });
}
