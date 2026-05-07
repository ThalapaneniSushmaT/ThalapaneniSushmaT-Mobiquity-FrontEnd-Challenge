import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { APP_CONFIG } from '../config/app-config';

export const tmdbApiKeyInterceptor: HttpInterceptorFn = (req, next) => {
  const config = inject(APP_CONFIG);

  const isTmdbRequest = req.url.startsWith(config.tmdbBaseUrl);
  if (!isTmdbRequest) return next(req);

  const alreadyHasKey = req.params.has('api_key');
  if (alreadyHasKey) return next(req);

  return next(
    req.clone({
      params: req.params.set('api_key', config.tmdbApiKey)
    })
  );
};

