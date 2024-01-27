import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { Pager } from './Pager';
import { Selection } from './Selection';

export class PageSelection<T> {
  constructor(private pager: Pager<T>, private selection: Selection<T>) {
    combineLatest([this.selection.selected$, this.pager.currentPage$])
      .pipe(
        map(([, currentPage]) => this.selection.isSelectedMultiple(currentPage))
      )
      .subscribe(this.currentPageSelected$);
  }

  selectCurrentPage() {
    this.selection.selectMultiple(this.pager.currentPage);
  }

  unselectCurrentPage() {
    this.selection.unselectMultiple(this.pager.currentPage);
  }

  currentPageSelected$ = new BehaviorSubject<boolean>(false);

  get currentPageSelected() {
    return this.currentPageSelected$.value;
  }
}
