import { Component, ElementRef, HostListener, inject, signal, viewChild } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly router = inject(Router);
  private readonly main = viewChild.required<ElementRef<HTMLElement>>('main');
  protected readonly showGoToTop = signal(false);
  protected readonly isScrolled = signal(false);

  constructor() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => {
        queueMicrotask(() =>
          this.main().nativeElement.focus({ preventScroll: true })
        );
      });
  }

  @HostListener('window:scroll')
  protected onWindowScroll() {
    const y = window.scrollY;
    this.showGoToTop.set(y > 320);
    this.isScrolled.set(y > 8);
  }

  protected goToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
