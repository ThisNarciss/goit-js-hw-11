import './css/styles.css';

const API_KEY = '32144711-033503d2fc66376fdc1e9e47c';
const BACKEND_REF = 'https://pixabay.com/api/';

const formRef = document.querySelector('.search-form');
const inputRef = document.querySelector('.search-form input');
const btnRef = document.querySelector('.search-form button');

console.log(formRef);
console.log(inputRef);
console.log(btnRef);

// formRef.addEventListener('submit', onSubmitSearch);
inputRef.addEventListener('input', onInputSearchImg);

function onInputSearchImg(evt) {
  evt.preventDefault();
  const inputVal = evt.target.value;
  fetch(
    `https://pixabay.com/api/?key=32144711-033503d2fc66376fdc1e9e47c&q=${inputVal}&image_type=photo&orientation=horizontal&safesearch=true`
  )
    .then(response => {
      return response.json();
    })
    .then(result => {
      console.log(result);
    });
}
