import { BehaviorSubject, Observable, combineLatest, map, tap } from 'rxjs';

export class Filter<T> {
  source$ = new BehaviorSubject([] as T[]);
  filters$ = new BehaviorSubject([] as Array<(i: T) => boolean>);
  filtered$ = new BehaviorSubject([] as T[]);

  get filtered() {
    return this.filtered$.value;
  }

  setDataSource(source: T[] | Observable<T[]>) {
    if (source instanceof Observable) {
      source.subscribe(this.source$);
      return;
    }
    this.source$.next(source);
  }

  constructor(source: T[] | Observable<T[]>) {
    this.setDataSource(source);

    combineLatest([this.source$, this.filters$])
      .pipe(
        map(([source, filters]) =>
          source.filter((item) => filters.every((filter) => filter(item)))
        ),
        tap((filtered) => console.log('filtered', filtered))
      )
      .subscribe(this.filtered$);
  }

  addFilter(filter: (i: T) => boolean) {
    this.filters$.next([...this.filters$.value, filter]);
  }

  clearFilters() {
    this.filters$.next([]);
  }

  setFilters(filters: Array<(i: T) => boolean>) {
    this.filters$.next(filters);
  }
}
