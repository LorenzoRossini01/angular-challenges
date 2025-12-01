import { Component } from '@angular/core';
import { CustomPipe } from './pipes/customPipe.pipe';

@Component({
  selector: 'app-root',
  imports: [CustomPipe],
  template: `
    @for (person of persons; track person) {
      {{ person | customPipe: $index }}
    }
  `,
})
export class AppComponent {
  persons = ['toto', 'jack'];
}
