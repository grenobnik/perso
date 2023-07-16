import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TODOS, TODOS_PROVIDER } from './todos.provider';
import { ToDo, TodosApi } from '../../data-models';
import { Observable } from 'rxjs';
import { FakeApiToDoService } from '../../services';

@Component({
  selector: 'expo-todos',
  templateUrl: './todos.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // example of using Injection Token to provide an observable stream of data
  providers: [TODOS_PROVIDER],
})
export class TodosComponent {
  readonly todos$ = inject<Observable<TodosApi>>(TODOS);

  private readonly todosService = inject(FakeApiToDoService);

  markAsCompleted(id: string): void {
    this.todosService.markAsCompleted(id);
  }

  pastDueDate(todo: ToDo): boolean {
    if (todo?.completedAt) {
      return false;
    }
    const date = todo?.dueDate;
    const now = new Date().getTime();
    return date ? now - date > 0 : false;
  }
}
