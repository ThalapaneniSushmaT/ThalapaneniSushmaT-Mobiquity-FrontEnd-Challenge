import { afterNextRender, Component, computed, effect, inject, Injector } from '@angular/core';
import { MovieListStore } from '../../state/movie-list.store';
import { MovieListScrollService } from '../../state/movie-list-scroll.service';
import { ErrorStateComponent } from '../../../../shared/ui/error-state/error-state.component';
import { LoadingSpinnerComponent } from '../../../../shared/ui/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../../shared/ui/empty-state/empty-state.component';
import { GenreFilterComponent } from '../../ui/genre-filter/genre-filter.component';
import { MovieCardComponent } from '../../ui/movie-card/movie-card.component';

@Component({
  standalone: true,
  imports: [
    ErrorStateComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    GenreFilterComponent,
    MovieCardComponent
  ],
  styleUrl: './movies-page.component.scss',
  templateUrl: './movies-page.component.html'
})
export class MoviesPageComponent {
  protected readonly store = inject(MovieListStore);
  private readonly scrollMemory = inject(MovieListScrollService);
  private readonly injector = inject(Injector);

  protected readonly genres = computed(() => Array.from(this.store.genresById().values()));
  protected readonly movies = computed(() => this.store.filteredMovies());

  constructor() {
    this.store.load();

    effect(() => {
      if (this.store.state() !== 'success') return;
      const list = this.store.filteredMovies();
      if (list.length === 0) return;

      if (this.scrollMemory.peekScrollToMovieId() == null) return;

      afterNextRender(
        () => {
          requestAnimationFrame(() =>
            requestAnimationFrame(() => {
              const pending = this.scrollMemory.peekScrollToMovieId();
              if (pending == null) return;
              const el = document.getElementById(`movie-${pending}`);
              if (!(el instanceof HTMLElement)) return;
              this.scrollMemory.consumeScrollToMovieId();
              el.scrollIntoView({ block: 'center', behavior: 'auto' });
              el.focus({ preventScroll: true });
            })
          );
        },
        { injector: this.injector }
      );
    });
  }

  protected unknownError() {
    return $localize`:@@errors.generic:Something went wrong. Please try again.`;
  }

  protected emptyTitle() {
    return $localize`:@@movies.emptyTitle:No movies match your filter`;
  }

  protected emptyMessage() {
    return $localize`:@@movies.emptyMessage:Try selecting a different genre.`;
  }

  protected loadedMoreAnnouncement() {
    const count = this.store.lastLoadedCount();
    if (count <= 0) return '';
    return `${count} ${$localize`:@@movies.loadedMoreSuffix:more movies loaded.`}`;
  }
}

