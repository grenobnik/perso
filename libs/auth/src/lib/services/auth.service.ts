import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of } from 'rxjs';
import { ApiResponse, User } from '../data-models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _user$$ = new BehaviorSubject<User | null>(null);

  readonly user$ = this._user$$.asObservable();

  readonly isLoggedIn$ = this.user$.pipe(map((user) => !!user));

  readonly isAdmin$ = this.user$.pipe(map((user) => !!user?.isAdmin));

  readonly userNickname$ = this.user$.pipe(
    map((user) => user?.user.slice(0, 3))
  );

  // fake login
  public login$(user: string, pwd: string): Observable<ApiResponse> {
    if (this._user$$.value !== null) {
      this._user$$.next(null);
    }
    if (user === 'admin' && pwd === 'admin') {
      this._user$$.next({ user, isAdmin: true });
      return of({ success: true, message: 'login successful', code: 200 });
    } else if (user === 'guest' && pwd === 'guest') {
      this._user$$.next({ user, isAdmin: false });
      return of({ success: true, message: 'login successful', code: 200 });
    }
    return of({ success: false, message: 'invalid credentials', code: 404 });
  }

  logout$(): Observable<ApiResponse> {
    this._user$$.next(null);
    return of({ success: true, message: 'logout successful', code: 200 });
  }
}
