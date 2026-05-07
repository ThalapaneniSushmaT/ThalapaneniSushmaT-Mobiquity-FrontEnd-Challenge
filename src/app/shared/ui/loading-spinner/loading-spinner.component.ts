import { Component, input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-loading-spinner',
  styleUrl: './loading-spinner.component.scss',
  template: `
    <div class="wrap" role="status" aria-live="polite">
      <div class="spinner" aria-hidden="true"></div>
      <span class="label">{{ label() }}</span>
    </div>
  `
})
export class LoadingSpinnerComponent {
  label = input($localize`:@@loading.label:Loading…`);
}