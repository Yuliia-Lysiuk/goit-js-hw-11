import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from "axios";



const form = document.querySelector("#search-form");
const galleryConteiner = document.querySelector(".gallery");


 

form.addEventListener("submit", onSubmit);

// let gallery = new SimpleLightbox('.gallery a', {
//       showCounter: true,
//       disableScroll: true,
// });
     
// function onCardClick(evt) {
//   evt.preventDefault();

//   gallery.open('.gallery');
// }

function onSubmit(e) {
    e.preventDefault();
    const inputValue = e.target.searchQuery.value;
    fetchPhoto(inputValue).then(renderPhoto).catch(error => {
        console.log(error);
    })
    
    form.reset();
}

 

function fetchPhoto(inputValue) {
    return fetch(`https://pixabay.com/api/?key=24419358-338d9960aaa56c480bc3e3cda&q=${inputValue}&image_type=photo&orientation=horizontal&safesearch=true&webformatURL&largeImageURL&tags&likes&views&comments&downloads&per_page=40`).then(
        (response) => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.json();
        }
    )    
}

function renderPhoto(photos) {
    console.log(photos.total);
    if (photos.total === 0) {
        galleryConteiner.innerHTML = "";
        return Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again."); 
    }
    Notiflix.Notify.success(`Hooray! We found ${photos.totalHits} images.`);
    
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

    return galleryConteiner.innerHTML = markup;
}
