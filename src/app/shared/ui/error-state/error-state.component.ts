import { Component, input, output } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-error-state',
  styleUrl: './error-state.component.scss',
  template: `
    <section class="card" role="alert" aria-live="assertive">
      <h2 class="title" i18n="@@errors.title">Something went wrong</h2>
      <p class="message">{{ message() }}</p>
      <button type="button" class="btn" (click)="retry.emit()" i18n="@@errors.retry">Retry</button>
    </section>
  `
})
export class ErrorStateComponent {
  message = input.required<string>();
  retry = output<void>();
}

