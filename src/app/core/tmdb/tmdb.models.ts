export type TmdbPaginatedResponse<T> = Readonly<{
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}>;

export type TmdbMovieListItem = Readonly<{
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  genre_ids: number[];
  vote_average: number;
}>;

export type TmdbGenre = Readonly<{
  id: number;
  name: string;
}>;

export type TmdbGenresResponse = Readonly<{
  genres: TmdbGenre[];
}>;

export type TmdbMovieDetail = Readonly<{
  id: number;
  title: string;
  tagline: string;
  poster_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  runtime: number | null;
  genres: TmdbGenre[];
}>;

