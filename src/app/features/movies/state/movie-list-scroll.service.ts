import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MovieListScrollService {
  private scrollToMovieId: number | null = null;

  rememberOpenedMovie(id: number): void {
    this.scrollToMovieId = id;
  }

  peekScrollToMovieId(): number | null {
    return this.scrollToMovieId;
  }

  clearPendingMovie(): void {
    this.scrollToMovieId = null;
  }

  consumeScrollToMovieId(): number | null {
    const id = this.scrollToMovieId;
    this.scrollToMovieId = null;
    return id;
  }
}
