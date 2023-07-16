import { Route } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './guards/auth.guard';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'todos',
  },
  {
    path: 'todos',
    loadChildren: () => import('@expo/todos').then((m) => m.TodosModule),
    canActivate: [authGuard],
  },
  { path: 'login', component: LoginComponent },
];
