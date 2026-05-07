import { Injectable, computed, inject, signal } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { retryBackoff } from '../../../core/rx/retry-backoff';
import { TmdbClient } from '../../../core/tmdb/tmdb-client.service';
import { type TmdbGenre, type TmdbMovieListItem } from '../../../core/tmdb/tmdb.models';
import { MovieListScrollService } from './movie-list-scroll.service';

export type LoadState = 'idle' | 'loading' | 'success' | 'error';

@Injectable({ providedIn: 'root' })
export class MovieListStore {
  private static readonly MAX_PAGES = 20;
  private readonly movies = signal<TmdbMovieListItem[]>([]);
  private readonly genres = signal<TmdbGenre[]>([]);
  private readonly currentPage = signal(0);
  private readonly totalPages = signal(1);
  readonly loadingMore = signal(false);

  readonly selectedGenreId = signal<number | null>(null);
  readonly state = signal<LoadState>('idle');
  readonly errorMessage = signal<string | null>(null);
  readonly lastLoadedCount = signal(0);
  readonly hasMore = computed(
    () => this.currentPage() < Math.min(this.totalPages(), MovieListStore.MAX_PAGES)
  );

  readonly genresById = computed(() => new Map(this.genres().map((g) => [g.id, g])));
  readonly filteredMovies = computed(() => this.movies());

  private readonly tmdb = inject(TmdbClient);
  private readonly scrollMemory = inject(MovieListScrollService);

  load(force = false) {
    if (this.state() === 'loading') return;
    if (!force && this.state() === 'success' && this.movies().length > 0) return;

    this.state.set('loading');
    this.errorMessage.set(null);

    this.currentPage.set(0);
    this.totalPages.set(1);
    this.movies.set([]);
    this.lastLoadedCount.set(0);

    const genres$ =
      this.genres().length > 0
        ? of(this.genres())
        : this.tmdb.getGenres().pipe(map((r) => r.genres));

    forkJoin({
      movies: this.loadMoviesByFilter(1, this.selectedGenreId()),
      genres: genres$
    })
      .pipe(
        retryBackoff({ maxRetries: 2, initialDelayMs: 350 }),
        catchError((err) => {
          const message =
            err?.status === 0
              ? $localize`:@@errors.network:Network error. Please check your connection and try again.`
              : $localize`:@@errors.generic:Something went wrong. Please try again.`;
          this.errorMessage.set(message);
          this.state.set('error');
          return of({ movies: null, genres: [] as TmdbGenre[] });
        }),
        finalize(() => {
          if (this.state() !== 'error') this.state.set('success');
        })
      )
      .subscribe(({ movies, genres }) => {
        if (!movies) return;
        this.movies.set(movies.results);
        this.genres.set(genres);
        this.currentPage.set(movies.page);
        this.totalPages.set(movies.total_pages);
        this.lastLoadedCount.set(movies.results.length);
      });
  }

  async loadMore() {
    if (this.state() !== 'success') return;
    if (!this.hasMore() || this.loadingMore()) return;

    let totalAdded = 0;

    this.loadingMore.set(true);

    try {
      while (this.hasMore()) {
        const nextPage = this.currentPage() + 1;
        const page = await firstValueFrom(
          this.loadMoviesByFilter(nextPage, this.selectedGenreId()).pipe(
            retryBackoff({ maxRetries: 2, initialDelayMs: 350 }),
            catchError(() => of(null))
          )
        );
        if (!page) break;

        const previousCount = this.movies().length;
        const uniqueById = new Map<number, TmdbMovieListItem>();
        for (const movie of this.movies()) uniqueById.set(movie.id, movie);
        for (const movie of page.results) {
          if (!uniqueById.has(movie.id)) uniqueById.set(movie.id, movie);
        }

        const nextMovies = Array.from(uniqueById.values());
        this.movies.set(nextMovies);
        this.currentPage.set(page.page);
        this.totalPages.set(page.total_pages);
        totalAdded += Math.max(0, nextMovies.length - previousCount);
        break;
      }
    } finally {
      this.lastLoadedCount.set(totalAdded);
      this.loadingMore.set(false);
    }
  }

  setSelectedGenre(genreId: number | null) {
    if (this.selectedGenreId() === genreId) return;
    this.scrollMemory.clearPendingMovie();
    this.selectedGenreId.set(genreId);
    this.load(true);
  }

  retry() {
    this.load(true);
  }

  clearFilter() {
    this.setSelectedGenre(null);
  }

  private loadMoviesByFilter(page: number, genreId: number | null) {
    if (genreId) {
      return this.tmdb.getMoviesByGenre(genreId, page);
    }
    return this.tmdb.getPopularMovies(page);
  }
}

