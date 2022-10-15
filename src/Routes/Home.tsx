import { useQuery } from "react-query";
import { getMovies } from "../api";

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
  },
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

function Home() {
  const { data, isLoading, } = useQuery<MoviesResult>(["movies", "nowPlaying"], getMovies);
  console.log('data', data, isLoading);

  return <div style={{ backgroundColor: "", height: "200vh"}}></div>;
}

export default Home;
