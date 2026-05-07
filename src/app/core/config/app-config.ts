import { InjectionToken } from '@angular/core';

export type AppConfig = Readonly<{
  tmdbApiKey: string;
  tmdbBaseUrl: string;
  tmdbImageBaseUrl: string;
}>;

export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');

