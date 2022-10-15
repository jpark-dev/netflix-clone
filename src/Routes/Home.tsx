import { useQuery } from "react-query";
import { getMovies, MoviesResult } from "../api";

function Home() {
  const { data, isLoading } = useQuery<MoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );

  return <div style={{ backgroundColor: "", height: "200vh" }}></div>;
}

export default Home;
