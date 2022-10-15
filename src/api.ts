const BASE_URL =
  "https://api.themoviedb.org/3/movie/now_playing?api_key=0cad3c39c392fdd7603017a627b29b50&language=en-US&page=1";
const API_KEY = process.env.REACT_APP_MOVIE_API_KEY;

interface Movie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}
export interface MoviesResult {
  dates: {
    minimum: string;
    maximum: string;
  };
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export function getMovies() {
  return fetch(`${BASE_URL}/movie/now_playing?api_key${API_KEY}`).then((res) =>
    res.json()
  );
}
