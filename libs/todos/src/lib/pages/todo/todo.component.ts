import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@expo/auth';
import { Message } from 'primeng/api';
import { of, switchMap } from 'rxjs';
import { FakeApiToDoService } from '../../services';

@Component({
  selector: 'expo-todo',
  templateUrl: './todo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoComponent implements OnInit {
  authService = inject(AuthService);

  private readonly activatedRoute = inject(ActivatedRoute);

  private readonly todosService = inject(FakeApiToDoService);

  private readonly router = inject(Router);

  modifyTodoId: string | null = null;

  formGroup = new FormGroup({
    description: new FormControl<string>('', {
      validators: [Validators.required, Validators.minLength(10)],
    }),
    dueDate: new FormControl<Date | null>(null),
    isImportant: new FormControl<boolean[]>([]),
  });

  messages?: Message[];

  ngOnInit(): void {
    this.formGroup.valueChanges.subscribe((value) => {
      console.log(value);
      console.log(this.formGroup);
    });
    this.activatedRoute.paramMap
      .pipe(
        switchMap((params) => {
          this.modifyTodoId = params.get('id');
          if (this.modifyTodoId == null) {
            return of(null);
          }
          return this.todosService.getTodoById$(this.modifyTodoId);
        })
      )
      .subscribe((todo) => {
        if (!todo && this.modifyTodoId) {
          this.messages = [
            {
              severity: 'error',
              summary: 'Error',
              detail: 'ToDo item not found, go back and try again',
            },
          ];
          this.formGroup.disable();
        } else {
          this.formGroup.setValue({
            description: todo?.description ?? '',
            dueDate: todo?.dueDate ? new Date(todo.dueDate) : null,
            isImportant: todo?.isImportant == null ? [] : [true],
          });
        }
      });
  }

  modifyTodo(): void {
    const description = this.formGroup.value.description;
    const dueDate = this.formGroup.value.dueDate
      ? new Date(this.formGroup.value.dueDate).getTime()
      : undefined;
    const isImportant = !!this.formGroup.value.isImportant?.length;
    if (description && this.modifyTodoId) {
      this.todosService
        .modifyTodo$({
          id: this.modifyTodoId,
          description,
          isImportant,
          dueDate,
        })
        .subscribe((response) => {
          if (response.success) {
            setTimeout(() => this.router.navigate(['todos']));
          } else {
            this.messages = [
              {
                severity: 'error',
                summary: 'Error',
                detail: 'unable to update or create to do item',
              },
            ];
          }
        });
    }
  }

  createTodo(): void {
    const description = this.formGroup.value.description;
    const dueDate = this.formGroup.value.dueDate
      ? new Date(this.formGroup.value.dueDate).getTime()
      : undefined;
    const isImportant = !!this.formGroup.value.isImportant?.length;
    if (description) {
      this.todosService
        .createTodo$({ description, dueDate, isImportant })
        .subscribe((response) => {
          if (response.success) {
            this.router.navigate(['todos']);
          } else {
            this.messages = [
              {
                severity: 'error',
                summary: 'Error',
                detail: response.message,
              },
            ];
          }
        });
    } else {
      this.messages = [
        {
          severity: 'error',
          summary: 'Error',
          detail: 'form invalid',
        },
      ];
    }
  }
}
