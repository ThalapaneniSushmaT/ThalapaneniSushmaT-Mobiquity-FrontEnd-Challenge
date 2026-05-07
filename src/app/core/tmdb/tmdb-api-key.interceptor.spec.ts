import { HttpParams, HttpRequest } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { APP_CONFIG } from '../config/app-config';
import { tmdbApiKeyInterceptor } from './tmdb-api-key.interceptor';

describe('tmdbApiKeyInterceptor', () => {
  it('adds api_key param to TMDB requests', async () => {
    await TestBed.configureTestingModule({
      providers: [
        {
          provide: APP_CONFIG,
          useValue: {
            tmdbApiKey: 'KEY',
            tmdbBaseUrl: 'https://api.example.test',
            tmdbImageBaseUrl: 'https://img.example.test'
          }
        }
      ]
    }).compileComponents();

    const req = new HttpRequest('GET', 'https://api.example.test/movie/popular', {
      params: new HttpParams()
    });

    let calledUrl = '';
    let calledParams = new HttpParams();

    await TestBed.runInInjectionContext(async () => {
      tmdbApiKeyInterceptor(req, (r) => {
        calledUrl = r.url;
        calledParams = r.params;
        return {} as any;
      });
    });

    expect(calledUrl).toBe('https://api.example.test/movie/popular');
    expect(calledParams.get('api_key')).toBe('KEY');
  });

  it('passes through non-TMDB requests', async () => {
    await TestBed.configureTestingModule({
      providers: [
        {
          provide: APP_CONFIG,
          useValue: {
            tmdbApiKey: 'KEY',
            tmdbBaseUrl: 'https://api.example.test',
            tmdbImageBaseUrl: 'https://img.example.test'
          }
        }
      ]
    }).compileComponents();

    const req = new HttpRequest('GET', '/assets/example.json', {
      params: new HttpParams()
    });

    let calledUrl = '';
    let calledParams = new HttpParams();

    await TestBed.runInInjectionContext(async () => {
      tmdbApiKeyInterceptor(req, (r) => {
        calledUrl = r.url;
        calledParams = r.params;
        return {} as any;
      });
    });

    expect(calledUrl).toBe('/assets/example.json');
    expect(calledParams.has('api_key')).toBe(false);
  });
});

