import { InjectionToken, Provider } from '@angular/core';
import { Observable } from 'rxjs';
import { TodosApi } from '../../data-models';
import { FakeApiToDoService } from '../../services';

export const TODOS = new InjectionToken<Observable<TodosApi>>(
  'Observable with list of To Do and loading state'
);

const todosFactory = (service: FakeApiToDoService) => {
  return service.getTodos$();
};

export const TODOS_PROVIDER: Provider = {
  provide: TODOS,
  deps: [FakeApiToDoService],
  useFactory: todosFactory,
};
