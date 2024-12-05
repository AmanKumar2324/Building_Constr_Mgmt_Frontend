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

   // Handle the form submission
  //  onLogin() {
  //   this.isLoading = true;
  //   this.errorMessage = '';

  //   // Prepare the request body
  //   const credentials = {
  //     roleUserId: this.roleUserId,
  //     password: this.password,
  //   };

  //   // Call the AuthService to authenticate the user
  //   this.authService.login(credentials).subscribe({
  //     next: (response) => {
  //       // Save the JWT token and user details in localStorage
  //       localStorage.setItem('token', response.token);
  //       localStorage.setItem('user', JSON.stringify(response.user));

  //       // Navigate to the respective role's dashboard
  //       this.router.navigate(['/home']);
  //       // const roleRoute = response.user.role.replace(' ', '-').toLowerCase(); // e.g., "Project Manager" -> "project-manager"
  //       // this.router.navigate([`/${roleRoute}`]);
  //     },
  //     error: (err) => {
  //       this.isLoading = false;
  //       this.errorMessage = 'Invalid Role User ID or Password';
  //     },
  //   });
  // }
  onLogin() {
    this.isLoading = true;
    this.errorMessage = '';
  
    const credentials = {
      roleUserId: this.roleUserId,
      password: this.password,
    };
  
    this.authService.login(credentials).subscribe({
      next: (response) => {
        // Save JWT token and user details in localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
  
        // Determine the route based on the user's role
        const roleRoute = this.getRouteForRole(response.user.role);
        if (roleRoute) {
          this.router.navigate([`/${roleRoute}`]);
        } else {
          this.errorMessage = 'Role not recognized. Please contact support.';
        }
      },
      error: (err) => {
        this.isLoading = false;
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
