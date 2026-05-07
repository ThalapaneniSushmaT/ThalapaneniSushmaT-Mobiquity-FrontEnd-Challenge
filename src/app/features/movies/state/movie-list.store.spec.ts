import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { TmdbClient } from '../../../core/tmdb/tmdb-client.service';
import { MovieListStore } from './movie-list.store';

describe('MovieListStore', () => {
  it('reloads movies from discover endpoint when genre changes', async () => {
    const getMoviesByGenre = jest.fn((genreId: number) =>
      of({
        page: 1,
        results: [
          {
            id: 3,
            title: `Genre-${genreId}`,
            poster_path: null,
            release_date: '2020-01-01',
            genre_ids: [genreId],
            vote_average: 7.5
          }
        ],
        total_pages: 1,
        total_results: 1
      })
    );

    const tmdbMock: Partial<TmdbClient> = {
      getPopularMovies: () =>
        of({
          page: 1,
          results: [
            {
              id: 1,
              title: 'A',
              poster_path: null,
              release_date: '2020-01-01',
              genre_ids: [10],
              vote_average: 7.2
            },
            {
              id: 2,
              title: 'B',
              poster_path: null,
              release_date: '2020-01-01',
              genre_ids: [20],
              vote_average: 8.1
            }
          ],
          total_pages: 1,
          total_results: 2
        }),
      getMoviesByGenre,
      getGenres: () =>
        of({
          genres: [
            { id: 10, name: 'Action' },
            { id: 20, name: 'Comedy' }
          ]
        })
    };

    await TestBed.configureTestingModule({
      providers: [
        MovieListStore,
        {
          provide: TmdbClient,
          useValue: tmdbMock
        }
      ]
    }).compileComponents();

    const store = TestBed.inject(MovieListStore);
    store.load();

    expect(store.state()).toBe('success');
    expect(store.filteredMovies().map((m) => m.id)).toEqual([1, 2]);

    store.setSelectedGenre(10);
    expect(getMoviesByGenre).toHaveBeenCalledWith(10, 1);
    expect(store.filteredMovies().map((m) => m.id)).toEqual([3]);
    expect(store.filteredMovies().every((m) => m.genre_ids.includes(10))).toBe(true);

    store.setSelectedGenre(null);
    expect(store.filteredMovies().map((m) => m.id)).toEqual([1, 2]);
  });

  it('loads multiple popular-movie pages and deduplicates by movie id', async () => {
    const getPopularMovies = jest.fn((page: number) =>
      of({
        page,
        results:
          page === 1
            ? [
                {
                  id: 1,
                  title: 'A',
                  poster_path: null,
                  release_date: '2020-01-01',
                  genre_ids: [10],
                  vote_average: 7.2
                }
              ]
            : page === 2
              ? [
                  {
                    id: 1,
                    title: 'A',
                    poster_path: null,
                    release_date: '2020-01-01',
                    genre_ids: [10],
                    vote_average: 7.2
                  },
                  {
                    id: 2,
                    title: 'B',
                    poster_path: null,
                    release_date: '2020-01-02',
                    genre_ids: [20],
                    vote_average: 8.1
                  }
                ]
              : [
                  {
                    id: 3,
                    title: 'C',
                    poster_path: null,
                    release_date: '2020-01-03',
                    genre_ids: [30],
                    vote_average: 8.9
                  }
                ],
        total_pages: 10,
        total_results: 3
      })
    );

    const tmdbMock: Partial<TmdbClient> = {
      getPopularMovies,
      getMoviesByGenre: () =>
        of({
          page: 1,
          results: [],
          total_pages: 1,
          total_results: 0
        }),
      getGenres: () => of({ genres: [] })
    };

    await TestBed.configureTestingModule({
      providers: [
        MovieListStore,
        {
          provide: TmdbClient,
          useValue: tmdbMock
        }
      ]
    }).compileComponents();

    const store = TestBed.inject(MovieListStore);
    store.load();
    await store.loadMore();
    await store.loadMore();

    expect(getPopularMovies).toHaveBeenCalledTimes(3);
    expect(getPopularMovies).toHaveBeenNthCalledWith(1, 1);
    expect(getPopularMovies).toHaveBeenNthCalledWith(2, 2);
    expect(getPopularMovies).toHaveBeenNthCalledWith(3, 3);
    expect(store.filteredMovies().map((m) => m.id)).toEqual([1, 2, 3]);
  });

  it('loads next page for selected genre from discover endpoint', async () => {
    const getMoviesByGenre = jest.fn((genreId: number, page: number) =>
      of({
        page,
        results: [
          {
            id: page,
            title: `Genre-${genreId}-Page-${page}`,
            poster_path: null,
            release_date: '2020-01-01',
            genre_ids: [genreId],
            vote_average: 7.2
          }
        ],
        total_pages: 3,
        total_results: 3
      })
    );

    const tmdbMock: Partial<TmdbClient> = {
      getPopularMovies: () =>
        of({
          page: 1,
          results: [],
          total_pages: 1,
          total_results: 0
        }),
      getMoviesByGenre,
      getGenres: () => of({ genres: [] })
    };

    await TestBed.configureTestingModule({
      providers: [
        MovieListStore,
        {
          provide: TmdbClient,
          useValue: tmdbMock
        }
      ]
    }).compileComponents();

    const store = TestBed.inject(MovieListStore);
    store.setSelectedGenre(30);

    await store.loadMore();

    expect(getMoviesByGenre).toHaveBeenNthCalledWith(1, 30, 1);
    expect(getMoviesByGenre).toHaveBeenNthCalledWith(2, 30, 2);
  });

  it('supports alternating genre selections and falls back to popular', async () => {
    const getPopularMovies = jest.fn(() =>
      of({
        page: 1,
        results: [{ id: 1, title: 'Popular', poster_path: null, release_date: '2020-01-01', genre_ids: [], vote_average: 7 }],
        total_pages: 1,
        total_results: 1
      })
    );
    const getMoviesByGenre = jest.fn((genreId: number) =>
      of({
        page: 1,
        results: [
          {
            id: genreId,
            title: `Genre-${genreId}`,
            poster_path: null,
            release_date: '2020-01-01',
            genre_ids: [genreId],
            vote_average: 7.2
          }
        ],
        total_pages: 1,
        total_results: 1
      })
    );

    await TestBed.configureTestingModule({
      providers: [
        MovieListStore,
        { provide: TmdbClient, useValue: { getPopularMovies, getMoviesByGenre, getGenres: () => of({ genres: [] }) } }
      ]
    }).compileComponents();

    const store = TestBed.inject(MovieListStore);
    store.setSelectedGenre(10);
    store.setSelectedGenre(20);
    store.setSelectedGenre(null);

    expect(getMoviesByGenre).toHaveBeenNthCalledWith(1, 10, 1);
    expect(getMoviesByGenre).toHaveBeenNthCalledWith(2, 20, 1);
    expect(getPopularMovies).toHaveBeenCalledTimes(1);
    expect(store.filteredMovies().map((m) => m.id)).toEqual([1]);
  });

  it('handles empty API responses as a successful empty list', async () => {
    await TestBed.configureTestingModule({
      providers: [
        MovieListStore,
        {
          provide: TmdbClient,
          useValue: {
            getPopularMovies: () => of({ page: 1, results: [], total_pages: 1, total_results: 0 }),
            getMoviesByGenre: () => of({ page: 1, results: [], total_pages: 1, total_results: 0 }),
            getGenres: () => of({ genres: [] })
          }
        }
      ]
    }).compileComponents();

    const store = TestBed.inject(MovieListStore);
    store.load();

    expect(store.state()).toBe('success');
    expect(store.filteredMovies()).toEqual([]);
    expect(store.errorMessage()).toBeNull();
  });

  it('retry forces a reload after initial success', async () => {
    const getPopularMovies = jest.fn(() =>
      of({ page: 1, results: [], total_pages: 1, total_results: 0 })
    );

    await TestBed.configureTestingModule({
      providers: [
        MovieListStore,
        {
          provide: TmdbClient,
          useValue: {
            getPopularMovies,
            getMoviesByGenre: () => of({ page: 1, results: [], total_pages: 1, total_results: 0 }),
            getGenres: () => of({ genres: [] })
          }
        }
      ]
    }).compileComponents();

    const store = TestBed.inject(MovieListStore);
    store.load();
    store.retry();

    expect(getPopularMovies).toHaveBeenCalledTimes(2);
  });

  it('sets error state with network-friendly message when loading fails', async () => {
    jest.useFakeTimers();
    try {
      await TestBed.configureTestingModule({
        providers: [
          MovieListStore,
          {
            provide: TmdbClient,
            useValue: {
              getPopularMovies: () => throwError(() => ({ status: 0 })),
              getMoviesByGenre: () => throwError(() => ({ status: 0 })),
              getGenres: () => of({ genres: [] })
            }
          }
        ]
      }).compileComponents();

      const store = TestBed.inject(MovieListStore);
      store.load();

      jest.runAllTimers();
      await Promise.resolve();

      expect(store.state()).toBe('error');
      expect(store.errorMessage()).toContain('Network error');
      expect(store.filteredMovies()).toEqual([]);
    } finally {
      jest.useRealTimers();
    }
  });
});

