import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MovieListScrollService } from '../../state/movie-list-scroll.service';
import { TmdbClient } from '../../../../core/tmdb/tmdb-client.service';
import { type TmdbMovieListItem } from '../../../../core/tmdb/tmdb.models';

@Component({
  standalone: true,
  selector: 'app-movie-card',
  imports: [RouterLink, DecimalPipe, DatePipe],
  styleUrl: './movie-card.component.scss',
  templateUrl: './movie-card.component.html'
})
export class MovieCardComponent {
  movie = input.required<TmdbMovieListItem>();

  protected readonly scrollMemory = inject(MovieListScrollService);

  constructor(private readonly tmdb: TmdbClient) {}

  posterUrl() {
    return this.tmdb.posterUrl(this.movie().poster_path);
  }

  ariaLabel() {
    return `${$localize`:@@movies.openDetailsPrefix:Open details for`} ${this.movie().title}`;
  }
}

