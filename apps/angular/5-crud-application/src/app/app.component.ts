import { Component, inject, OnInit } from '@angular/core';
import { Todo } from './models/todo.model';
import { FakeHttpService } from './service/fake-http.service';

@Component({
  selector: 'app-root',
  template: `
    <div>
      @if (error()) {
        <div
          style="color: #842029; background:#f8d7da; padding:8px; border-radius:4px; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
          <span>{{ error() }}</span>
          <button (click)="clearError()">Chiudi</button>
        </div>
      }

      @if (loading()) {
        <div style="margin:8px 0;">Caricamento...</div>
      } @else {
        @for (todo of todos(); track todo.id) {
          <p>{{ todo.id }}. {{ todo.title }}</p>
          <button (click)="update(todo)" [disabled]="loading()">Update</button>
          <button (click)="delete(todo)" [disabled]="loading()">Delete</button>
        }
      }
    </div>
  `,
  styles: [],
})
export class AppComponent implements OnInit {
  private fakeHttpService = inject(FakeHttpService);

  todos = this.fakeHttpService.todos;
  error = this.fakeHttpService.error;
  loading = this.fakeHttpService.loading;

  ngOnInit(): void {
    console.log(this.todos());
  }

  update(todo: Todo) {
    this.fakeHttpService.updateTodo(todo).subscribe();
  }
  delete(todo: Todo) {
    this.fakeHttpService.deleteTodo(todo).subscribe();
  }

  clearError() {
    this.fakeHttpService.clearError();
  }
}
