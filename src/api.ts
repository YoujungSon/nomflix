const API_KEY = '7a1b0ea41e9a2e54f71801bc4dc1f6f2';
const BASE_PATH = 'https://api.themoviedb.org/3/';

interface Imove {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  vote_average: number;
  vote_count: number;
}
interface Icategory {
  name: string;
}
interface Icompony {
  logo_path: string;
  name: string;
}
interface Itv {
  id: number;
  name: string;
  backdrop_path: string;
  overview: string;
}

interface Isimilar {
  poster_path: string;
  name: string;
  id: number;
  backdrop_path: string;
  overview: string;
}
export interface IGetTvResult {
  results: Itv[];
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
export interface IGetTvSimilar {
  results: Isimilar[];
}
export interface IGetTvDetail {
  tagline: string;
  vote_average: number;
  vote_count: number;
  genres: Icategory[];
}
export interface IGetMovieDetail {
  tagline: string;
  genres: Icategory[];
  production_companies: Icompony[];
  vote_average: number;
  vote_count: number;
}
export function getMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=ko&page=1&region=KR`).then((response) =>
    response.json(),
  );
}
export function getMovieDetails(bigMovieId: string) {
  return fetch(`${BASE_PATH}/movie/${bigMovieId}?api_key=${API_KEY}&language=ko`).then((response) => response.json());
}
export function getTvs() {
  return fetch(`${BASE_PATH}/tv/90462/recommendations?api_key=${API_KEY}&language=ko&page=1`).then((response) =>
    response.json(),
  );
}
export function getTvsDetails(bigTvId: string) {
  return fetch(`${BASE_PATH}/tv/${bigTvId}?api_key=${API_KEY}&language=ko`).then((response) => response.json());
}
export function getTvsSimilar(bigTvId: string) {
  return fetch(`${BASE_PATH}/tv/${bigTvId}/similar?api_key=${API_KEY}&language=ko&page=1`).then((response) =>
    response.json(),
  );
}
