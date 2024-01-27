import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';

export class Selection<T> {
  selected$ = new BehaviorSubject(new Set<T>());
  source$ = new BehaviorSubject([] as T[]);

  constructor() {}

  setDataSource(source: T[] | Observable<T[]>) {
    if (source instanceof Observable) {
      source.subscribe(this.source$);
      return;
    }
    this.source$.next(source);
  }

  isSelectedMultiple(multiple: T[]) {
    if (multiple.length === 0) {
      return false;
    }
    return multiple.every((single) => this.selected$.value.has(single));
  }

  toggle(single: T) {
    if (this.selected$.value.has(single)) {
      this.unselectMultiple([single]);
    } else {
      this.selectMultiple([single]);
    }
  }

  selectMultiple(multiple: T[]) {
    console.log(multiple);
    multiple.forEach((single) => this.selected$.value.add(single));
    this.selected$.next(this.selected$.value);
  }

  unselectMultiple(multiple: T[]) {
    multiple.forEach((single) => this.selected$.value.delete(single));
    this.selected$.next(this.selected$.value);
  }

  selectAll() {
    this.selected$.next(new Set(this.source$.value));
  }

  unselectAll() {
    this.selected$.next(new Set());
  }
}
