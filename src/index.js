import axios from 'axios';
import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';


const form = document.querySelector("#search-form");
const galleryConteiner = document.querySelector(".gallery");
const loadMoreBtn = document.querySelector(".load-more");

hideBtnLoadMore()

form.addEventListener("submit", onSubmit);

let page = 1;

let per_page = 40;

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
  per_page = 40;
    fetchItems = async function() {
      try {
        const photo = await fetchPhoto(inputValue);
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

async function fetchPhoto(inputValue) {
  try {
    const response = await axios.get(`https://pixabay.com/api/?key=24419358-338d9960aaa56c480bc3e3cda&q=${inputValue}&page=${page}&image_type=photo&orientation=horizontal&safesearch=true&webformatURL&largeImageURL&tags&likes&views&comments&downloads&per_page=${per_page}`);
    return response.data
  } catch (e) {
    return Promise.reject(e);
  }
}

function renderPhoto(photos) {
  console.log(photos);
  if (photos.total === 0) {
    clearGalleryConteiner();
    hideBtnLoadMore();
    return Notify.failure("Sorry, there are no images matching your search query. Please try again.");
  }
  showBtnLoadMore();
      Notify.success(`Hooray! We found ${photos.totalHits} images.`);
      makeCard(photos);
  if  (photos.total < 41 || photos.hits.length < 40) {
    Notify.info("We're sorry, but you've reached the end of search results.");
    return hideBtnLoadMore();
  }
      showBtnLoadMore();
      makeCard(photos);
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