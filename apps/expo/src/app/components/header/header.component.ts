import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@expo/auth';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'expo-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private readonly authService = inject(AuthService);

  private readonly router = inject(Router);

  readonly menuItems: MenuItem[] = [
    {
      label: 'Mon profil',
      items: [
        {
          label: 'Logout',
          icon: 'pi pi-sign-out',
          command: () => {
            this.logout();
          },
        },
      ],
    },
  ];

  items: MenuItem[] | undefined;

  userNick$ = this.authService.userNickname$;

  logout(): void {
    this.authService.logout$();
    this.router.navigate(['login']);
  }
}
