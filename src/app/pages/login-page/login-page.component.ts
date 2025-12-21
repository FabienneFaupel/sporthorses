import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AuthApiService } from '../../services/auth-api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
 username = '';
  password = '';
  hidePw = true;

  loading = false;
  error: string | null = null;

  constructor(
    private authApi: AuthApiService,
    private auth: AuthService,
    private router: Router
  ) {}
  
  async doLogin() {
  const res = await this.authApi.login(this.username, this.password);
  this.auth.setSession(res);
  this.router.navigateByUrl('/');
}

  async ngOnInit() {
    // Wenn schon eingeloggt: direkt in die App
    if (this.auth.isLoggedIn) {
      await this.router.navigate(['/']);
    }
  }

  async login() {
  this.error = null;
  this.loading = true;

  try {
    await this.authApi.login(this.username.trim(), this.password);

    const returnUrl =
      new URLSearchParams(window.location.search).get('returnUrl') || '/';

    await this.router.navigateByUrl(returnUrl);
  } catch (e: any) {
    this.error = String(e?.message ?? e);
  } finally {
    this.loading = false;
  }
}

}