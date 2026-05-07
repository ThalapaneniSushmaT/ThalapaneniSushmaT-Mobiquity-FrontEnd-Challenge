import { TestBed } from '@angular/core/testing';
import { GenreFilterComponent } from './genre-filter.component';

describe('GenreFilterComponent', () => {
  it('does not emit while synchronizing selected genre from input', async () => {
    await TestBed.configureTestingModule({
      imports: [GenreFilterComponent]
    }).compileComponents();

    const fixture = TestBed.createComponent(GenreFilterComponent);
    fixture.componentRef.setInput('genres', [{ id: 10, name: 'Action' }]);
    fixture.componentRef.setInput('selectedGenreId', 10);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    const emitSpy = jest.spyOn(component.selectedGenreIdChange, 'emit');

    (component as any).onModelChange('10');
    expect(emitSpy).not.toHaveBeenCalled();

    (component as any).onModelChange('');
    expect(emitSpy).toHaveBeenCalledWith(null);
  });

  it('emits reliably across alternating genre selections', async () => {
    await TestBed.configureTestingModule({
      imports: [GenreFilterComponent]
    }).compileComponents();

    const fixture = TestBed.createComponent(GenreFilterComponent);
    fixture.componentRef.setInput('genres', [
      { id: 10, name: 'Action' },
      { id: 20, name: 'Comedy' }
    ]);
    fixture.componentRef.setInput('selectedGenreId', null);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    const emitSpy = jest.spyOn(component.selectedGenreIdChange, 'emit');

    (component as any).onModelChange('10');
    expect(emitSpy).toHaveBeenNthCalledWith(1, 10);

    fixture.componentRef.setInput('selectedGenreId', 10);
    fixture.detectChanges();

    (component as any).onModelChange('20');
    expect(emitSpy).toHaveBeenNthCalledWith(2, 20);

    fixture.componentRef.setInput('selectedGenreId', 20);
    fixture.detectChanges();

    (component as any).onModelChange('');
    expect(emitSpy).toHaveBeenNthCalledWith(3, null);
  });
});
