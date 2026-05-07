import { Routes } from '@angular/router';
import { movieDetailResolver } from './features/movies/routing/movie-detail.resolver';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'movies'
  },
  {
    path: 'movies',
    loadComponent: () =>
      import('./features/movies/pages/movies-page/movies-page.component').then((m) => m.MoviesPageComponent),
    title: $localize`:@@route.moviesTitle:Movie Explorer`
  },
  {
    path: 'movies/:id',
    loadComponent: () =>
      import('./features/movies/pages/movie-detail-page/movie-detail-page.component').then(
        (m) => m.MovieDetailPageComponent
      ),
    resolve: {
      movie: movieDetailResolver
    },
    title: $localize`:@@route.movieDetailTitle:Movie details`
  },
  {
    path: '**',
    loadComponent: () =>
      import('./shared/pages/not-found-page.component').then((m) => m.NotFoundPageComponent),
    title: $localize`:@@route.notFoundTitle:Not found`
  }
];
