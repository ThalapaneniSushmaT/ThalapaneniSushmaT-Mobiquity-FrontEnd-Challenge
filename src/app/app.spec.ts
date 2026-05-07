import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { App } from './app';

@Component({
  standalone: true,
  template: `<p>Dummy page</p>`
})
class DummyPageComponent {}

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([
          { path: '', component: DummyPageComponent },
          { path: 'movies', component: DummyPageComponent }
        ])
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('exposes basic accessibility landmarks and skip navigation', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    const skipLink = el.querySelector('a.skip-link');
    const main = el.querySelector('main#main');
    const header = el.querySelector('header[role="banner"]');
    const footer = el.querySelector('footer');

    expect(skipLink?.getAttribute('href')).toBe('#main');
    expect(main?.getAttribute('tabindex')).toBe('-1');
    expect(header).toBeTruthy();
    expect(footer).toBeTruthy();
  });

  it('moves focus to main content after route navigation', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const router = TestBed.inject(Router);
    const main = fixture.nativeElement.querySelector('main#main') as HTMLElement;
    const focusSpy = jest.spyOn(main, 'focus');

    await router.navigateByUrl('/movies');
    await fixture.whenStable();
    await Promise.resolve();

    expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true });
  });
});
