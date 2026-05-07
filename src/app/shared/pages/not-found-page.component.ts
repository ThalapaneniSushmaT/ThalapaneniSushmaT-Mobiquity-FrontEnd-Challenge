import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink],
  styleUrl: './not-found-page.component.scss',
  template: `
    <section class="card" aria-labelledby="title">
      <h1 id="title" i18n="@@notFound.title">Page not found</h1>
      <p i18n="@@notFound.body">The page you’re looking for doesn’t exist.</p>
      <p class="actions">
        <a routerLink="/movies" class="btn" i18n="@@notFound.back">Back to movies</a>
      </p>
    </section>
  `
})
export class NotFoundPageComponent {}

