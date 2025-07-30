import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  http = inject(HttpClient);
  router = inject(Router);

  onLogin() {
    const formValue = this.loginForm.value;

    this.http.post('https://dummyjson.com/auth/login', formValue).subscribe({
      next: (result: any) => {
        const accessToken = result.accessToken;
        const id = result.id;

        if (!accessToken) {
          alert('Login failed.');
          return;
        }

        this.http.get(`https://dummyjson.com/users/${id}`).subscribe({
          next: (user: any) => {
            console.log(user)
            const role = user.role || 'user'; // fallback in case 'role' doesn't exist
            const firstName = user.firstName;
            const lastName = user.lastName;
            const email = user.email;
            const image = user.image;
            const dept = user.company.department;
            const title = user.company.title;
            // Save to localStorage
            localStorage.setItem('login_token', accessToken);
            localStorage.setItem('user_role', role);
            localStorage.setItem('user_name', firstName + ' ' + lastName);
            localStorage.setItem('emp_id', id);
            localStorage.setItem('department', dept);
            localStorage.setItem('emp_title', title);
            localStorage.setItem('emp_email', email);
            localStorage.setItem('emp_image', image);

            // Route based on role
            if (role === 'admin' || role === 'moderator') {
              this.router.navigateByUrl('/admin_dashboard');
            } else {
              this.router.navigateByUrl('/employee_dashboard');
            }
          },
          error: () => {
            alert('Failed to fetch role');
          },
        });
      },
      error: (e) => {
        alert('Error: ' + (e.error?.message || e.message || 'Login error'));
      },
    });
  }
}
