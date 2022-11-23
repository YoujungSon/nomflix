import { useQuery } from '@tanstack/react-query';
import { getMovieDetails, getMovies, IGetMovieDetail, IGetMovieResult } from './../api';
import styled from 'styled-components';
import { makeImagePath } from './../utills';
import { motion, AnimatePresence, useViewportScroll } from 'framer-motion';
import { useState } from 'react';
import { useNavigate, useMatch, PathMatch } from 'react-router-dom';

const Wrapper = styled.div`
  background-color: black;
`;

const Loader = styled.div`
  height: 20vh;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgphoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${(props) => props.bgphoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 38px;
  margin-bottom: 20px;
  font-weight: bold;
`;

const OverView = styled.p`
  font-size: 20px;
  width: 40%;
  opacity: 0.8;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
`;

const Slider = styled.div`
  position: relative;
  top: -200px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  cursor: pointer;
  :first-child {
    transform-origin: center left;
    position: relative;
    ::before {
      content: '';
      width: 100%;
      height: 100%;
      position: absolute;
      background: linear-gradient(90deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0) 100%);
    }
  }
  :last-child {
    transform-origin: center right;
    position: relative;
    ::before {
      content: '';
      width: 100%;
      height: 100%;
      position: absolute;
      background: linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.9) 100%);
    }
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const OverLay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 85vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.veryDark};
  text-align: center;
`;

const BigCover = styled.div`
  width: 100%;
  background-position: center center;
  background-size: cover;
  height: 400px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 15px;
`;
const SubTitle = styled.p`
  font-size: 18px;
  margin-bottom: 15px;
`;
const BigOverview = styled.p`
  color: ${(props) => props.theme.white.lighter};
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;

const CategoryList = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  li {
    ::marker {
      font-size: 0;
    }
    padding: 5px;
    border-radius: 3px;
    background-color: ${(props) => props.theme.black.lighter};
  }
`;

const BigMovieWrap = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  padding: 30px;
`;

const LeftButton = styled.button`
  background-color: transparent;
  border: 0;
  color: ${(props) => props.theme.white.lighter};
  font-size: 30px;
  cursor: pointer;
  position: absolute;
  top: 0;
  left: 30px;
  z-index: 99;
  height: 200px;
`;

const RightButton = styled.button`
  background-color: transparent;
  border: 0;
  color: ${(props) => props.theme.white.lighter};
  font-size: 30px;
  cursor: pointer;
  position: absolute;
  top: 0;
  right: 30px;
  z-index: 99;
  height: 200px;
`;

const CompanyWrap = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 30px;
  > div {
    width: 100px;
    padding: 20px;
    background-color: ${(props) => props.theme.white.lighter};
    > img {
      width: 80%;
    }
  }
`;

const VoteWrap = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-bottom: 10px;
  font-size: 18px;
  font-weight: bold;
  p {
    opacity: 1;

    span {
      opacity: 0.7;
    }
  }
`;

const BoxVariants = {
  narmal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    zIndex: 99,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: 'tween',
    },
  },
};

const rowVariants = {
  hidden: {
    x: window.outerWidth + 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 5,
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: 'tween',
    },
  },
};
const offset = 6; // 한번에 보여주고싶은 수

function Home() {
  const navigate = useNavigate();
  const bigMovieMatch: PathMatch<string> | null = useMatch('/movies/:id');
  const bigMovieId = bigMovieMatch?.params.id ?? '';
  const { scrollY } = useViewportScroll();
  const { data: movieData, isLoading: movieLoding } = useQuery<IGetMovieResult>(['movies', 'nowPlaying'], getMovies);
  const { data: detailData } = useQuery<IGetMovieDetail>(['details', bigMovieId], () => getMovieDetails(bigMovieId));
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);

  const increaseIndex = () => {
    if (movieData) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = movieData?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const decreaseIndex = () => {
    if (movieData) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = movieData?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev - 1));
    }
  };
  const toggleLeaving = () => {
    setLeaving((prev) => !prev);
  };

  const onBoxClickd = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };

  const onOverlayClick = () => {
    navigate(`/`);
  };

  const clickedMovie =
    bigMovieMatch?.params.id && movieData?.results.find((movie) => movie.id + '' === bigMovieMatch.params.id);

  return (
    <Wrapper>
      {movieLoding ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bgphoto={makeImagePath(movieData?.results[0].backdrop_path || '')}>
            <Title>{movieData?.results[0].title}</Title>
            <OverView>{movieData?.results[0].overview}</OverView>
          </Banner>
          <Slider>
            <LeftButton onClick={decreaseIndex}>&lt;</LeftButton>
            <RightButton onClick={increaseIndex}>&gt;</RightButton>

            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial='hidden'
                animate='visible'
                exit='exit'
                key={index}
                transition={{ type: 'tween', duration: 1 }}
              >
                {movieData?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((movie) => (
                    <Box
                      layoutId={movie.id + ''}
                      key={movie.id}
                      variants={BoxVariants}
                      whileHover='hover'
                      initial='normal'
                      onClick={() => onBoxClickd(movie.id)}
                      transition={{ type: 'tween' }}
                      bgphoto={makeImagePath(movie.backdrop_path, 'w500')}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          <AnimatePresence>
            {bigMovieMatch && (
              <>
                <OverLay onClick={onOverlayClick} exit={{ opacity: 0 }} animate={{ opacity: 1 }} />
                <BigMovie layoutId={bigMovieMatch.params.id} style={{ top: scrollY.get() + 100 }}>
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedMovie.backdrop_path,
                            'w500',
                          )})`,
                        }}
                      />
                      <BigMovieWrap>
                        <BigTitle>{clickedMovie.title}</BigTitle>
                        <SubTitle>"{detailData?.tagline}"</SubTitle>
                        <CategoryList>
                          {detailData?.genres.map((category) => (
                            <li>#{category.name}</li>
                          ))}
                        </CategoryList>
                        <VoteWrap>
                          <p>
                            {detailData?.vote_average.toFixed(1)}
                            <span> /10</span>
                          </p>
                          <p>
                            {detailData?.vote_count}
                            <span> 명</span>
                          </p>
                        </VoteWrap>
                        <BigOverview>{clickedMovie.overview}</BigOverview>
                        <CompanyWrap>
                          {detailData?.production_companies.map(
                            (company) =>
                              company && (
                                <div>
                                  <img src={makeImagePath(company?.logo_path, 'w300')} alt={company?.name} />
                                </div>
                              ),
                          )}
                        </CompanyWrap>
                      </BigMovieWrap>
                    </>
                  )}
                </BigMovie>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}
export default Home;
