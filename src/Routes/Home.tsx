import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovies, MoviesResult } from "../api";
import { makeImgPath } from "../lib/utils";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useState } from "react";
import { useNavigate, useMatch } from "react-router-dom";

const Wrapper = styled.div`
  background: black;
  overflow-x: hidden;
`;

const Banner = styled.div<{ bgImg: string }>`
  height: 120vh;
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

const Slider = styled.div`
  top: -200px;
  position: relative;
`;

const SliderRow = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;
const SliderBox = styled(motion.div)<{ bgImg: string }>`
  background-color: white;
  height: 200px;
  font-size: 64px;
  background-image: url(${(props) => props.bgImg});
  background-size: cover;
  background-position: center center;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
  cursor: pointer;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
`;

const sliderRowVariants = {
  hidden: {
    x: window.outerWidth - 150,
  },
  active: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth + 150,
  },
};

const MovieBoxInfo = styled(motion.div)`
  color: white;
  position: absolute;
  width: 100%;
  bottom: 0;
  padding: 10px;
  opacity: 0;
  background-color: ${(props) => props.theme.black.lighter};
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  opacity: 0;
`;

const sliderBoxVariants = {
  initial: {
    scale: 1,
  },
  hover: {
    scale: 1.2,
    y: -50,
    transition: { delay: 0.3, type: "tween", duration: 0.3 },
  },
};

const movieInfoVariants = {
  hover: {
    opacity: 1,
    transition: { delay: 0.3, type: "tween", duration: 0.3 },
  },
};

const pageOffset = 6;

function Home() {
  const navigate = useNavigate();
  const movieMatch = useMatch("/movies/:movieId");
  const { data, isLoading } = useQuery<MoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  const { scrollY } = useScroll();
  const [movieIndex, setMovieIndex] = useState(0);
  const [isSliderMoving, setisSliderMoving] = useState(false);

  const increaseMovieIndex = () => {
    if (data) {
      if (isSliderMoving) return;
      setisSliderMoving(true);
      const totalMovies = data.results.length - 1;
      const maxPageIndex = Math.floor(totalMovies / pageOffset) - 1;
      setMovieIndex((prev) => (prev === maxPageIndex ? 0 : prev + 1));
    }
  };
  const toggleSliderState = () => setisSliderMoving((prev) => !prev);
  const handleBoxClick = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };
  const handleOverlayClick = () => {
    navigate("/");
  };

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            onClick={increaseMovieIndex}
            bgImg={makeImgPath(data?.results[0].backdrop_path || "")}
          >
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleSliderState}>
              <SliderRow
                key={movieIndex}
                variants={sliderRowVariants}
                initial="hidden"
                animate="active"
                exit="exit"
                transition={{ type: "tween", duration: 0.5 }}
              >
                {data?.results
                  .slice(1)
                  .slice(
                    pageOffset * movieIndex,
                    pageOffset * movieIndex + pageOffset
                  )
                  .map((movie) => (
                    <SliderBox
                      variants={sliderBoxVariants}
                      initial="initial"
                      whileHover="hover"
                      transition={{ type: "tween" }}
                      bgImg={makeImgPath(movie.backdrop_path, "w500")}
                      key={movie.id}
                      onClick={() => handleBoxClick(movie.id)}
                      layoutId={movie.id + ""}
                    >
                      <MovieBoxInfo variants={movieInfoVariants}>
                        <h4>{movie.title}</h4>
                      </MovieBoxInfo>
                    </SliderBox>
                  ))}
              </SliderRow>
            </AnimatePresence>
          </Slider>
          <AnimatePresence>
            {movieMatch ? (
              <>
                <Overlay
                  onClick={handleOverlayClick}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <motion.div
                  layoutId={movieMatch.params.movieId}
                  style={{
                    position: "absolute",
                    width: "40vw",
                    height: "80vh",
                    backgroundColor: "white",
                    top: scrollY.get() + 100,
                    left: 0,
                    right: 0,
                    margin: "0 auto",
                  }}
                />
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
