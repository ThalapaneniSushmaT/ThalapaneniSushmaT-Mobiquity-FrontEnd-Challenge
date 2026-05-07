import { Component, effect, input, output, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { type TmdbGenre } from '../../../../core/tmdb/tmdb.models';

@Component({
  standalone: true,
  selector: 'app-genre-filter',
  imports: [FormsModule],
  styleUrl: './genre-filter.component.scss',
  templateUrl: './genre-filter.component.html'
})
export class GenreFilterComponent {
  genres = input.required<TmdbGenre[]>();
  selectedGenreId = input.required<number | null>();
  disabled = input(false);
  selectedGenreIdChange = output<number | null>();

  /** Keeps `<select>` in sync with `@Input`; avoids flaky `[value]` + `(change)` on route re-entry */
  protected readonly selectModel = signal<string>('');

  constructor() {
    effect(() => {
      const id = this.selectedGenreId();
      const str = id == null ? '' : String(id);
      untracked(() => {
        if (this.selectModel() !== str) this.selectModel.set(str);
      });
    });
  }

  protected onModelChange(raw: string) {
    const normalized = typeof raw === 'string' ? raw.trim() : String(raw ?? '');
    this.selectModel.set(normalized);
    const next: number | null = normalized === '' ? null : Number(normalized);
    if (next !== null && !Number.isFinite(next)) return;

    const current = this.selectedGenreId();
    if (next === current) return;

    this.selectedGenreIdChange.emit(next);
  }
}
