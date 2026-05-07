import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { APP_CONFIG } from '../config/app-config';
import { type TmdbGenresResponse, type TmdbMovieDetail, type TmdbMovieListItem, type TmdbPaginatedResponse } from './tmdb.models';

@Injectable({ providedIn: 'root' })
export class TmdbClient {
  private readonly http = inject(HttpClient);
  private readonly config = inject(APP_CONFIG);

  getPopularMovies(page = 1) {
    return this.http.get<TmdbPaginatedResponse<TmdbMovieListItem>>(
      `${this.config.tmdbBaseUrl}/movie/popular`,
      { params: { page } }
    );
  }

  getMoviesByGenre(genreId: number, page = 1) {
    return this.http.get<TmdbPaginatedResponse<TmdbMovieListItem>>(
      `${this.config.tmdbBaseUrl}/discover/movie`,
      { params: { with_genres: genreId, page } }
    );
  }

  getMovieDetail(id: number) {
    return this.http.get<TmdbMovieDetail>(`${this.config.tmdbBaseUrl}/movie/${id}`);
  }

  getGenres() {
    return this.http.get<TmdbGenresResponse>(`${this.config.tmdbBaseUrl}/genre/movie/list`);
  }

  posterUrl(posterPath: string | null): string | null {
    if (!posterPath) return null;
    return `${this.config.tmdbImageBaseUrl}${posterPath}`;
  }
}

