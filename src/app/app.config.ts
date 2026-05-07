import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { APP_CONFIG } from './core/config/app-config';
import { tmdbApiKeyInterceptor } from './core/tmdb/tmdb-api-key.interceptor';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([tmdbApiKeyInterceptor])),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled'
      })
    ),
    {
      provide: APP_CONFIG,
      useFactory: () => {
        if (!environment.tmdbApiKey || environment.tmdbApiKey.startsWith('REPLACE_')) {
          throw new Error(
            'TMDB API key missing. Set `tmdbApiKey` in `src/environments/environment.development.ts`.'
          );
        }

        return {
          tmdbApiKey: environment.tmdbApiKey,
          tmdbBaseUrl: environment.tmdbBaseUrl,
          tmdbImageBaseUrl: environment.tmdbImageBaseUrl
        };
      }
    }
  ]
};