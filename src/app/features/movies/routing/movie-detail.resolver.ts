import { ResolveFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { retryBackoff } from '../../../core/rx/retry-backoff';
import { TmdbClient } from '../../../core/tmdb/tmdb-client.service';
import { type TmdbMovieDetail } from '../../../core/tmdb/tmdb.models';

export type MovieDetailResolved =
  | Readonly<{ kind: 'success'; movie: TmdbMovieDetail }>
  | Readonly<{ kind: 'notFound' }>
  | Readonly<{ kind: 'error'; message: string }>;

export const movieDetailResolver: ResolveFn<MovieDetailResolved> = (route) => {
  const tmdb = inject(TmdbClient);
  const router = inject(Router);

  const rawId = route.paramMap.get('id');
  const id = rawId ? Number(rawId) : NaN;

  if (!Number.isFinite(id)) {
    router.navigateByUrl('/movies');
    return of({ kind: 'notFound' } as const);
  }

  return tmdb.getMovieDetail(id).pipe(
    retryBackoff({ maxRetries: 2, initialDelayMs: 350 }),
    map((movie: TmdbMovieDetail) => ({ kind: 'success', movie }) as const),
    catchError((err) => {
      if (err?.status === 404) return of({ kind: 'notFound' } as const);
      const message =
        err?.status === 0
          ? $localize`:@@errors.network:Network error. Please check your connection and try again.`
          : $localize`:@@errors.generic:Something went wrong. Please try again.`;
      return of({ kind: 'error', message } as const);
    })
  );
};

