import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(private authService: AuthService) {}

  logout(): void {
    this.authService.logout(); // 🚀 Ya redirige según el rol
  }

  getUsername(): string {
    const user = this.authService.getCurrentUser();
    return user ? user.nombre : '';
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }
}