import { Component, input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-empty-state',
  styleUrl: './empty-state.component.scss',
  template: `
    <section class="card" role="status" aria-live="polite">
      <h2 class="title">{{ title() }}</h2>
      <p class="message">{{ message() }}</p>
    </section>
  `
})
export class EmptyStateComponent {
  title = input($localize`:@@empty.title:No results`);
  message = input($localize`:@@empty.message:Try a different genre.`);
}

