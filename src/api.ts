const BASE_URL = "https://api.themoviedb.org/3/movie/now_playing?api_key=0cad3c39c392fdd7603017a627b29b50&language=en-US&page=1";
const API_KEY = process.env.REACT_APP_MOVIE_API_KEY;

export function getMovies() {
  return fetch(`${BASE_URL}/movie/now_playing?api_key${API_KEY}`).then(res => res.json());
}
