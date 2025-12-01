import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { randText } from '@ngneat/falso';
import { of, throwError } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { Todo } from '../models/todo.model';

@Injectable({
  providedIn: 'root',
})
export class FakeHttpService {
  private http = inject(HttpClient);
  todos = signal<Todo[]>([]);
  error = signal<string | null>(null);
  loading = signal<boolean>(false);

  constructor() {
    // Avvia il caricamento iniziale
    this.getTodos().subscribe();
  }

  /** Restituisce l'observable del fetching ma aggiorna i signals internamente */
  getTodos() {
    this.loading.set(true);
    return this.http
      .get<Todo[]>('https://jsonplaceholder.typicode.com/todos')
      .pipe(
        tap((todos) => {
          this.todos.set(todos);
          this.error.set(null);
        }),
        catchError((err) => {
          console.error('getTodos pipe error', err);
          this.error.set('Errore nel recupero delle todo');
          return of([] as Todo[]);
        }),
        finalize(() => this.loading.set(false)),
      );
  }

  updateTodo(todo: Todo) {
    this.loading.set(true);
    const payload = {
      id: todo.id,
      title: randText(),
      body: todo.body,
      userId: todo.userId,
      completed: todo.completed,
    } as Partial<Todo>;

    return this.http
      .put<Todo>(
        `https://jsonplaceholder.typicode.com/todos/${todo.id}`,
        payload,
      )
      .pipe(
        tap((todoUpdated) => {
          const updated = this.todos().map((t) =>
            t.id === todoUpdated.id ? todoUpdated : t,
          );
          this.todos.set(updated);
          this.error.set(null);
        }),
        catchError((err) => {
          console.error('updateTodo error', err);
          this.error.set("Errore durante l'aggiornamento del todo");
          return throwError(() => err);
        }),
        finalize(() => this.loading.set(false)),
      );
  }

  deleteTodo(todo: Todo) {
    this.loading.set(true);
    return this.http
      .delete<void>(`https://jsonplaceholder.typicode.com/todos/${todo.id}`)
      .pipe(
        tap(() => {
          this.todos.set(this.todos().filter((t) => t.id !== todo.id));
          this.error.set(null);
        }),
        catchError((err) => {
          console.error('deleteTodo error', err);
          this.error.set('Errore durante la cancellazione del todo');
          return throwError(() => err);
        }),
        finalize(() => this.loading.set(false)),
      );
  }

  clearError() {
    this.error.set(null);
  }
}
