import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@expo/auth';
import { Message } from 'primeng/api';

@Component({
  selector: 'expo-login',
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  authService = inject(AuthService);

  router = inject(Router);

  formGroup = new FormGroup({
    user: new FormControl<string>(''),
    pwd: new FormControl<string>(''),
  });

  messages?: Message[];

  submit(): void {
    const { user, pwd } = this.formGroup.value;
    if (user?.trim() && pwd?.trim()) {
      this.authService.login$(user, pwd).subscribe({
        next: (response) => {
          if (response.success) {
            this.router.navigate(['/']);
          } else {
            this.messages = [
              {
                severity: 'error',
                summary: 'Error',
                detail: response.message,
              },
            ];
          }
        },
      });
    }
  }
}
