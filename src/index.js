import './css/styles.css';
import Notiflix from 'notiflix';
import createMurkUp from './create-murk-up';
import GalleryApiService from './gallery-service';

const galleryApiService = new GalleryApiService();

const formRef = document.querySelector('.search-form');
const loadMoreBtn = document.querySelector('.load-more');
const galleryRef = document.querySelector('div.gallery');

formRef.addEventListener('submit', onSearchSubmit);
loadMoreBtn.addEventListener('click', onLoadMoreClick);
// window.addEventListener('scroll', onLoadMoreScroll);

async function onSearchSubmit(evt) {
  evt.preventDefault();
  galleryRef.innerHTML = '';
  loadMoreBtn.classList.remove('is-seen');
  galleryApiService.page = 1;
  const inputValue = evt.currentTarget.elements.searchQuery.value.trim();
  galleryApiService.searchQuery = inputValue;
  try {
    if (inputValue) {
      const articles = await galleryApiService.fetchArticles();
      if (!articles.data.total) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }

      Notiflix.Notify.success(
        `Hooray! We found ${articles.data.totalHits} images.`
      );

      createMurkUp(articles.data.hits, galleryRef);
      scrollPageDown();
      if (articles.data.totalHits > 40) {
        loadMoreBtn.classList.add('is-seen');
      }
    }
  } catch (error) {}
}

async function onLoadMoreClick() {
  try {
    const articles = await galleryApiService.fetchArticles();
    createMurkUp(articles.data.hits, galleryRef);
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

function scrollPageDown() {
  const { height: cardHeight } =
    galleryRef.firstElementChild.getBoundingClientRect();

  return window.scrollBy({
    top: cardHeight * 10,
    behavior: 'smooth',
  });
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
