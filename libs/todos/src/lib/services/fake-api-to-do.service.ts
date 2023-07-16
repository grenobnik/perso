import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  delay,
  map,
  of,
} from 'rxjs';
import { ToDo, TodosApi } from '../data-models';
import { ApiResponse, AuthService } from '@expo/auth';

@Injectable({
  providedIn: 'root',
})
export class FakeApiToDoService {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly authService: AuthService,
    private readonly window: Window
  ) {
    this._todos$$.next({ isLoading: true, value: [] });
    httpClient
      .get<ToDo[]>('assets/data-mock/todos.json')
      .pipe(delay(2000)) // fake API delay
      .subscribe({
        next: (todos) => {
          this._todos$$.next({ isLoading: false, value: todos });
        },
      });
  }

  // in memory storage
  private readonly _todos$$ = new BehaviorSubject<TodosApi>({
    isLoading: false,
    value: [],
  });

  getTodos$(): Observable<TodosApi> {
    // check permissions (only admin can see all users)
    return combineLatest([this._todos$$, this.authService.user$]).pipe(
      map(([todosApi, user]) => {
        if (user?.isAdmin) {
          return todosApi;
        }
        if (user) {
          return {
            ...todosApi,
            value: todosApi.value.filter((todo) => todo.user === user.user),
          };
        }
        return { isLoading: false, value: [] };
      })
    );
  }

  markAsCompleted(id: string): void {
    const todoIndex = this._todos$$.value.value.findIndex(
      (todo) => todo.id === id
    );
    if (todoIndex !== -1) {
      const todos = this._todos$$.value.value;
      todos[todoIndex].completed = true;
      todos[todoIndex].completedAt = new Date().getTime();
      this._todos$$.next({ isLoading: false, value: todos });
    }
  }

  getTodoById$(id: string): Observable<ToDo | null> {
    return this.authService.user$.pipe(
      map(
        (user) =>
          this._todos$$.value.value.find(
            (td) => td.id === id && (user?.isAdmin || user?.user === td.user)
          ) ?? null
      )
    );
  }

  modifyTodo$(todo: Partial<ToDo> & { id: string }): Observable<ApiResponse> {
    return this.authService.user$.pipe(
      map((user) => {
        const todoIndex = this._todos$$.value.value.findIndex(
          (td) => td.id === todo.id && (user?.isAdmin || user?.user === td.user)
        );
        if (todoIndex > -1) {
          const todos = this._todos$$.value.value;
          if (todo.description) {
            todos[todoIndex].description = todo.description;
          }
          if (todo.dueDate) {
            todos[todoIndex].dueDate = todo.dueDate;
          }
          todos[todoIndex].isImportant = todo.isImportant;
          this._todos$$.next({ isLoading: false, value: todos });
          return { code: 200, message: 'ok', success: true };
        }
        return { code: 403, message: 'not found', success: false };
      })
    );
  }

  createTodo$(
    todo: Partial<ToDo> & { description: string }
  ): Observable<ApiResponse> {
    return this.authService.user$.pipe(
      map((connectedUser) => {
        if (connectedUser) {
          const id = this.window.crypto.randomUUID();
          const user = connectedUser.user;
          const description = todo.description;
          const completed = false;
          const createdAt = new Date().getTime();
          const dueDate = todo.dueDate ?? undefined;
          const isImportant = !!todo.isImportant;
          this._todos$$.next({
            isLoading: false,
            value: [
              ...this._todos$$.value.value,
              {
                id,
                user,
                description,
                completed,
                createdAt,
                dueDate,
                isImportant,
              },
            ],
          });
        }
        return { code: 403, message: 'not found', success: false };
      })
    );
  }
}
