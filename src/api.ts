const API_KEY = '7a1b0ea41e9a2e54f71801bc4dc1f6f2';
const BASE_PATH = 'https://api.themoviedb.org/3/';

interface Imove {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

export interface IGetMovieResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: Imove[];
  total_pages: number;
  total_results: number;
}

export function getMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1&region=KR`).then((response) =>
    response.json(),
  );
}