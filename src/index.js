import 'simplelightbox/dist/simple-lightbox.min.css';
import SimpleLightbox from 'simplelightbox';
import QueryToApi from "./fetchAPI";
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const queryToApi = new QueryToApi();

const refs= {
    form: document.querySelector('#search-form'),
    button: document.querySelector('button[type="submit"]'),
    gallery: document.querySelector('.gallery'),
    input: document.querySelector('input[name="searchQuery"]'),
    loadMoreBtn: document.querySelector('.load-more'),
}

refs.loadMoreBtn.classList.add('is-hidden');

refs.form.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMoreClick)

function onFormSubmit(evt) {
  
  evt.preventDefault(evt);
  refs.gallery.innerHTML = '';
  queryToApi.query = evt.currentTarget.elements.searchQuery.value;
  queryToApi.resetPage();
  if (!queryToApi.query) {
         refs.gallery.innerHTML = ''; 
      return Notify.warning("Enter your search query, please!");  
    }
  queryToApi.getDataFromAPI()
    .then(response => {
      Notify.success(`Hooray! We found ${response.totalHits} images.`);
      const checkAmountOfHits = (response.totalHits / response.hits.length) < 1 ?
        refs.loadMoreBtn.classList.add('is-hidden') :
        refs.loadMoreBtn.classList.remove('is-hidden');
    
      return response;
    })
    .then(createCardMarkup)
    .then(() => {
      let gallery = new SimpleLightbox('.gallery a');
      
      return gallery;
    })

  refs.form.reset();
 
}



function createCardMarkup({ hits }) {
  
  const markup = hits.map(({ tags, likes, webformatURL, comments, downloads, views, largeImageURL }) => {
    return `<a href="${largeImageURL}" class="photo-card">
            <img class="img" src="${webformatURL}" alt="${tags}" width="310" height="207" loading="lazy" />
            <div class="info">
                <p class="info-item">
                    <b>Likes</b>
                    ${likes}
                </p>
                <p class="info-item">
                    <b>Views</b>
                    ${views}
                </p>
                <p class="info-item">
                    <b>Comments</b>
                    ${comments}
                </p>
                <p class="info-item">
                    <b>Downloads</b>
                    ${downloads}
                </p>
            </div>
        </a>`
  }).join('');
    
    refs.gallery.insertAdjacentHTML('beforeend', markup);
   

}

function onLoadMoreClick(response) {

  queryToApi.getDataFromAPI()
    .then(response => {
         console.log(response.totalHits);
      console.log(response.hits.length)
        const checkAmountOfHits = (response.totalHits / response.hits.length) <= 1 ?
        refs.loadMoreBtn.classList.add('is-hidden') :
        refs.loadMoreBtn.classList.remove('is-hidden');
      return response;
    }).then(createCardMarkup)
    .then(() => {
      let gallery = new SimpleLightbox('.gallery a');
   
      return gallery;
    }).then(() => {
      const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    });;
  
}

function checkAmountOfHits() {
  
     if ((response.totalHits/response.hits.length)<=1) {
     refs.loadMoreBtn.classList.add('is-hidden');
      }

        refs.loadMoreBtn.classList.remove('is-hidden');
      
  
  
}
