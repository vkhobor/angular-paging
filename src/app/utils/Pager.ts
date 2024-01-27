import {
  BehaviorSubject,
  Observable,
  Subject,
  combineLatest,
  map,
  takeUntil,
} from 'rxjs';

export class Pager<T> {
  private destroy$ = new Subject<void>();
  source$: BehaviorSubject<T[]> = new BehaviorSubject([] as T[]);
  pageSize$: BehaviorSubject<number> = new BehaviorSubject(10);
  currentPageNumber$: BehaviorSubject<number> = new BehaviorSubject(1);
  currentPage$: BehaviorSubject<T[]> = new BehaviorSubject([] as T[]);
  totalPages$ = new BehaviorSubject(0);

  constructor(source: T[] | Observable<T[]>, pageSize = 10, currentPage = 1) {
    this.setDataSource(source);
    this.setPageSize(pageSize);
    this.setPage(currentPage);

    combineLatest([this.source$, this.pageSize$, this.currentPageNumber$])
      .pipe(
        map(([data, pageSize, currentPageNumber]) =>
          this.getPage(data, pageSize, currentPageNumber)
        )
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(this.currentPage$);

    combineLatest([this.source$, this.pageSize$])
      .pipe(map(([data, pageSize]) => Math.ceil(data.length / pageSize)))
      .pipe(takeUntil(this.destroy$))
      .subscribe(this.totalPages$);
  }

  private getPage(data: T[], pageSize: number, currentPage: number) {
    const startIndex = (currentPage - 1) * pageSize;
    return data.slice(startIndex, startIndex + pageSize);
  }

  destroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get currentPage() {
    return this.currentPage$.value;
  }

  get pageSize() {
    return this.pageSize$.value;
  }

  get totalPages() {
    return this.totalPages$.value;
  }

  get hasPreviousPage() {
    return this.currentPageNumber > 1;
  }

  get hasNextPage() {
    return this.currentPageNumber < this.totalPages$.value;
  }

  get currentPageNumber() {
    return this.currentPageNumber$.value;
  }

  get totalItems() {
    return this.source$.value.length;
  }

  setDataSource(source: T[] | Observable<T[]>) {
    if (source instanceof Observable) {
      source.pipe(takeUntil(this.destroy$)).subscribe(this.source$);
    } else {
      this.source$.next(source);
    }
  }

  setPageSize(pageSize: number) {
    this.pageSize$.next(pageSize);
  }

  setPage(page: number) {
    this.currentPageNumber$.next(page);
  }

  nextPage() {
    this.currentPageNumber$.next(this.currentPageNumber$.value + 1);
  }

  previousPage() {
    this.currentPageNumber$.next(this.currentPageNumber$.value - 1);
  }
}
