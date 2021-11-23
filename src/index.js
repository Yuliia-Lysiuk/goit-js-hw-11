
import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchPhoto } from './fetchAPI';


const form = document.querySelector("#search-form");
const galleryConteiner = document.querySelector(".gallery");
const loadMoreBtn = document.querySelector(".load-more");

hideBtnLoadMore()

form.addEventListener("submit", onSubmit);

let page = 1;

let fetchItems;
let gallery = new SimpleLightbox('.gallery a');
async function onSubmit(e) {
    e.preventDefault();
    const inputValue = e.target.searchQuery.value;
    if (!inputValue) {
        clearGalleryConteiner();
        hideBtnLoadMore();
      return Notify.warning("Enter your search query, please!");
    }
    galleryConteiner.innerHTML = ''
  page = 1;
 
    fetchItems = async function() {
      try {
        const photo = await fetchPhoto(inputValue, page);
        renderPhoto(photo);
        page += 1;
        loadMoreBtn.addEventListener("click", onLoadMore)
        gallery.refresh();
      } catch (error) {
        console.dir(error); 
      }
    }
    fetchItems()
    form.reset();
}

function renderPhoto(photos) {

  if (photos.total === 0) {
    clearGalleryConteiner();
    hideBtnLoadMore();
    return Notify.failure("Sorry, there are no images matching your search query. Please try again.");
  }
  if (page === 1) {
    Notify.success(`Hooray! We found ${photos.totalHits} images.`);  
  }
  showBtnLoadMore();
    
      makeCard(photos);
   if  (photos.total < 41 || photos.hits.length < 40) {
    Notify.info("We're sorry, but you've reached the end of search results.");
    return hideBtnLoadMore();
  }
  
   const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2 + 207,
    behavior: 'smooth',
  });
}

function clearGalleryConteiner() {
    galleryConteiner.innerHTML = '';
}

function hideBtnLoadMore() {
    loadMoreBtn.classList.add('is-hidden');
}

function showBtnLoadMore() {
    loadMoreBtn.classList.remove('is-hidden');
}

function onLoadMore() {
 
  if (fetchItems) {
    fetchItems();
    
  }
  
}
      
function makeCard(photos) {
  const markup = photos.hits.map(({ tags, likes, webformatURL, comments, downloads, views, largeImageURL }) => {
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
    }).join("");

    return galleryConteiner.insertAdjacentHTML("beforeend", markup);
}