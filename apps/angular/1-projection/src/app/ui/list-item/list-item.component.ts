import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { CityStore } from '../../data-access/city.store';
import { StudentStore } from '../../data-access/student.store';
import { TeacherStore } from '../../data-access/teacher.store';
import { CardType } from '../../model/card.model';
import { City } from '../../model/city.model';
import { Student } from '../../model/student.model';
import { Teacher } from '../../model/teacher.model';

@Component({
  selector: 'app-list-item',
  template: `
    <div class="border-grey-300 flex justify-between border px-2 py-1">
      {{ text() }}
      <button (click)="delete(item().id)">
        <img class="h-5" src="assets/svg/trash.svg" />
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListItemComponent {
  private teacherStore = inject(TeacherStore);
  private studentStore = inject(StudentStore);
  private cityStore = inject(CityStore);

  readonly item = input.required<City | Teacher | Student>();
  readonly type = input.required<CardType>();

  text = computed(() => {
    const type = this.type();

    if (type === CardType.TEACHER) {
      return (
        (this.item() as Teacher).firstName +
        ' ' +
        (this.item() as Teacher).lastName
      );
    } else if (type === CardType.STUDENT) {
      return (
        (this.item() as Student).firstName +
        ' ' +
        (this.item() as Student).lastName
      );
    } else {
      return (this.item() as City).name + ', ' + (this.item() as City).country;
    }
  });

  delete(id: number) {
    const type = this.type();
    if (type === CardType.TEACHER) {
      this.teacherStore.deleteOne(id);
    } else if (type === CardType.STUDENT) {
      this.studentStore.deleteOne(id);
    } else if (type === CardType.CITY) {
      this.cityStore.deleteOne(id);
    }
  }
}
