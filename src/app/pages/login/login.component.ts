import { Component, OnInit} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';  // Import HttpClientModule
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  providers: [AuthService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  role: string = 'Admin';
  roleUserId: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;
  constructor(private authService: AuthService, private router: Router) {}
  
  onLogin() {
    this.isLoading = true;
    this.errorMessage = '';
    
    const credentials = {
      roleUserId: this.roleUserId,
      password: this.password,
    };
  
    // Call the login API via AuthService
    this.authService.login(credentials).subscribe({
      next: (response) => {
        // Save JWT token and user details in localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('roleUserId', response.user.roleUserId);
  
        console.log('Login successful:', response);
  
        // Determine the route based on the user's role
        const roleRoute = this.getRouteForRole(response.user.role);
        if (roleRoute) {
          this.isLoading = false; // Stop loading
          this.router.navigate([`/${roleRoute}`]); // Navigate to the role-specific route
        } else {
          this.isLoading = false; // Stop loading
          this.errorMessage = 'Role not recognized. Please contact support.';
        }
      },
      error: (err) => {
        this.isLoading = false; // Stop loading
        console.error('Login failed:', err); // Debugging
        this.errorMessage = 'Invalid Role User ID or Password';
      },
    });
  }
  
  // Map roles to routes
  private getRouteForRole(role: string): string | null {
    const roleRoutes: { [key: string]: string } = {
      Admin: 'admin',
      'Project Manager': 'project-manager',
      Engineer: 'engineer',
      Architect: 'architect',
      'Site Supervisor': 'site-supervisor',
      Worker: 'worker',
    };
  
    return roleRoutes[role] || null; // Return the route or null if the role is not found
  }
  

}
