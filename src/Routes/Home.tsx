import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovies, MoviesResult } from "../api";
import { makeImgPath } from "../lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const Wrapper = styled.div`
  background: black;
  overflow-x: hidden;
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

const Slider = styled.div`
  top: -200px;
  position: relative;
`;

const SliderRow = styled(motion.div)`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;
const SliderBox = styled(motion.div)`
  background-color: white;
  height: 200px;
  color: red;
  font-size: 64px;
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
    x: window.outerWidth,
  },
  active: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth,
  },
};

function Home() {
  const { data, isLoading } = useQuery<MoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  const [movieIndex, setMovieIndex] = useState(0);
  const [isSliderMoving, setisSliderMoving] = useState(false);
  const increaseMovieIndex = () => {
    if (isSliderMoving) return;
    setisSliderMoving(true);
    setMovieIndex((prev) => prev + 1);
  };
  const toggleSliderState = () => setisSliderMoving((prev) => !prev);

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
            <AnimatePresence onExitComplete={toggleSliderState}>
              <SliderRow
                key={movieIndex}
                variants={sliderRowVariants}
                initial="hidden"
                animate="active"
                exit="exit"
                transition={{ type: "tween", duration: 0.5 }}
              >
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <SliderBox key={i}>{i}</SliderBox>
                ))}
              </SliderRow>
            </AnimatePresence>
          </Slider>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
