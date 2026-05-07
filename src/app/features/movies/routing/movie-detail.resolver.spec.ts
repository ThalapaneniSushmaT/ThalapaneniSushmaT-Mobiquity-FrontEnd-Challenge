import { TestBed } from '@angular/core/testing';
import {
  Router,
  convertToParamMap,
  type ActivatedRouteSnapshot,
  type RouterStateSnapshot
} from '@angular/router';
import { firstValueFrom, of, throwError } from 'rxjs';
import { TmdbClient } from '../../../core/tmdb/tmdb-client.service';
import { movieDetailResolver } from './movie-detail.resolver';

describe('movieDetailResolver', () => {
  it('returns notFound on 404', async () => {
    const navigateByUrl = jest.fn();
    await TestBed.configureTestingModule({
      providers: [
        {
          provide: TmdbClient,
          useValue: {
            getMovieDetail: () => throwError(() => ({ status: 404 }))
          }
        },
        {
          provide: Router,
          useValue: { navigateByUrl }
        }
      ]
    }).compileComponents();

    const route = {
      paramMap: convertToParamMap({ id: '123' })
    } as unknown as ActivatedRouteSnapshot;

    const result = await TestBed.runInInjectionContext(async () => {
      const obs$ = movieDetailResolver(route, {} as RouterStateSnapshot);
      return firstValueFrom(obs$);
    });

    expect(result.kind).toBe('notFound');
  });

  it('navigates back when id is invalid', async () => {
    const navigateByUrl = jest.fn();

    await TestBed.configureTestingModule({
      providers: [
        {
          provide: TmdbClient,
          useValue: { getMovieDetail: () => of(null) }
        },
        {
          provide: Router,
          useValue: { navigateByUrl }
        }
      ]
    }).compileComponents();

    const route = {
      paramMap: convertToParamMap({ id: 'abc' })
    } as unknown as ActivatedRouteSnapshot;

    const result = await TestBed.runInInjectionContext(async () => {
      const obs$ = movieDetailResolver(route, {} as RouterStateSnapshot);
      return firstValueFrom(obs$);
    });

    expect(navigateByUrl).toHaveBeenCalledWith('/movies');
    expect(result.kind).toBe('notFound');
  });
});

