import axios from 'axios';


export async function fetchPhoto(inputValue, page) {
  try {
    const response = await axios.get(`https://pixabay.com/api/?key=24419358-338d9960aaa56c480bc3e3cda&q=${inputValue}&page=${page}&image_type=photo&orientation=horizontal&safesearch=true&webformatURL&largeImageURL&tags&likes&views&comments&downloads&per_page=40`);
    console.log(response.data);
      return response.data
  } catch (e) {
    return Promise.reject(e);
  }
}

