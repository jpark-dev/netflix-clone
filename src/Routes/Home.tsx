import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovies, MoviesResult } from "../api";
import { makeImgPath } from "../lib/utils";

const Wrapper = styled.div`
  background: black;
`;

const Banner = styled.div<{ bgImg: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgImg});
  background-size: cover;
`;

const Title = styled.h2`
  color: white;
  font-size: 68px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  color: white;
  font-size: 36px;
  width: 50%;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
`;

function Home() {
  const { data, isLoading } = useQuery<MoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bgImg={makeImgPath(data?.results[0].backdrop_path || "")}>
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
