import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  isLoggedIn: boolean = true;

  constructor(private router: Router) {}

  ngOnInit() {
    this.checkLogin();
  }

  checkLogin() {
    const userId = localStorage.getItem('userId');
    this.isLoggedIn = !!userId; // true if exists
  }

  logout() {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('accountType');
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }
}
