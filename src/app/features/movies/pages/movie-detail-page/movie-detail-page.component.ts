import { DatePipe, DecimalPipe, NgOptimizedImage } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { TmdbClient } from '../../../../core/tmdb/tmdb-client.service';
import { ErrorStateComponent } from '../../../../shared/ui/error-state/error-state.component';
import { type MovieDetailResolved } from '../../routing/movie-detail.resolver';

@Component({
  standalone: true,
  imports: [RouterLink, ErrorStateComponent, DecimalPipe, DatePipe, NgOptimizedImage],
  styleUrl: './movie-detail-page.component.scss',
  templateUrl: './movie-detail-page.component.html'
})
export class MovieDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly tmdb = inject(TmdbClient);

  protected readonly resolved = toSignal(
    this.route.data.pipe(map((d) => d['movie'] as MovieDetailResolved)),
    { initialValue: { kind: 'notFound' } as MovieDetailResolved }
  );

  protected readonly posterUrl = computed(() => {
    const res = this.resolved();
    if (res.kind !== 'success') return null;
    return this.tmdb.posterUrl(res.movie.poster_path);
  });

  protected overviewFallback() {
    return $localize`:@@movieDetail.noOverview:No overview available.`;
  }
}

