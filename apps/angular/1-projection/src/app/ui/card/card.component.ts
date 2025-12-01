import { Component, input, output } from '@angular/core';

import { CardType } from '../../model/card.model';
import { ListItemComponent } from '../list-item/list-item.component';

@Component({
  selector: 'app-card',
  template: `
    <div
      class="flex w-fit flex-col gap-3 rounded-md border-2 border-black p-4"
      [class]="customClass()">
      <img [src]="image()" width="200" height="200" />

      <section>
        @for (item of list(); track item) {
          <app-list-item [item]="item" [type]="type()"></app-list-item>
        }
      </section>

      <button
        class="rounded-sm border border-blue-500 bg-blue-300 p-2"
        (click)="addNewItem()">
        Add
      </button>
    </div>
  `,

  styles: `
    .bg-light-red {
      background-color: rgba(250, 0, 0, 0.1);
    }
    .bg-light-blue {
      background-color: rgba(0, 196, 250, 0.1);
    }
    .bg-light-green {
      background-color: rgba(0, 250, 0, 0.1);
    }
  `,
  imports: [ListItemComponent],
})
export class CardComponent {
  readonly list = input<any[] | null>(null);
  readonly type = input.required<CardType>();
  readonly image = input.required<string>();
  readonly customClass = input('');
  handleAddBtnClick = output();
  CardType = CardType;

  addNewItem() {
    this.handleAddBtnClick.emit();
  }
}
