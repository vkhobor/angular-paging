import { Component } from '@angular/core';
import { Pager } from '../../utils/Pager';
import { Selection } from '../../utils/Selection';
import { PageSelection } from '../../utils/PageSelection';
import { CommonModule } from '@angular/common';
import { Filter } from '../../utils/Filter';
import { FormsModule, NgModel } from '@angular/forms';
import { DataService } from '../../services/data.service';

interface Item {
  id: number;
  name: string;
  value: number;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent {
  filter = new Filter<Item>(this.dataService.data$);
  pager = new Pager<Item>(this.filter.filtered$, 10, 1);
  selection = new Selection<Item>(this.filter.filtered$);
  pagerSelection = new PageSelection(this.pager, this.selection);

  onlyShowEvenValue = false;
  public onlyShowEven(value: boolean) {
    this.onlyShowEvenValue = value;
    if (value) {
      this.selection.unselectAll();
      this.pager.setPage(1);
      this.filter.addFilter((item) => item.value % 2 === 0);
    } else {
      this.selection.unselectAll();
      this.pager.setPage(1);
      this.filter.clearFilters();
    }
  }

  constructor(private dataService: DataService) {
    this.selection.selected$.subscribe((selected) => {
      if (selected.size > 15) {
        alert('You can select only 15 items');
      }
    });
  }

  handleSelectAllItemsChange(event: Event) {
    if (!this.pagerSelection.currentPageSelected) {
      this.pagerSelection.selectCurrentPage();
    } else {
      this.pagerSelection.unselectCurrentPage();
    }
  }

  handleSelectItemChange(event: Event, item: Item) {
    if (!this.selection.isSelectedMultiple([item])) {
      this.selection.selectMultiple([item]);
    } else {
      this.selection.unselectMultiple([item]);
    }
  }
}
