import { Route } from '@angular/router';
import { TodosComponent } from './pages/todos/todos.component';
import { TodoComponent } from './pages/todo/todo.component';

export const todosRoutes: Route[] = [
  { path: '', component: TodosComponent },
  {
    path: 'todo/:id',
    pathMatch: 'full',
    component: TodoComponent,
  },
  {
    path: 'todo',
    pathMatch: 'full',
    component: TodoComponent,
  },
];
