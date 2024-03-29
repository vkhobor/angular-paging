import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  data$: Observable<{ id: number; name: string; value: number }[]>;

  constructor() {
    this.data$ = new Observable((subscriber) => {
      setTimeout(() => {
        subscriber.next(this.generateRandomData(100_000));
        subscriber.complete();
      }, 1000);
    });
  }

  generateRandomData(rowCount: number): any[] {
    return Array.from({ length: rowCount }, (_, i) => ({
      id: i,
      name: Math.random().toString(36).substring(7),
      value: Math.floor(Math.random() * 100),
    }));
  }
}
