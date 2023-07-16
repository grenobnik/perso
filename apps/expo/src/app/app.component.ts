import { Component, inject } from '@angular/core';
import { AuthService } from '@expo/auth';

@Component({
  selector: 'expo-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  private readonly authService = inject(AuthService);

  isLoggedIn$ = this.authService.isLoggedIn$;
}
