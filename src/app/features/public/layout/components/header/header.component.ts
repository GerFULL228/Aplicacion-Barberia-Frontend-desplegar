import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TokenService } from '@/app/core/services/auth/token.service';
import { PUBLIC_PAGES } from '@/app/core/config/sites.config';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class HeaderComponent implements OnInit {
  private tokenService = inject(TokenService);
  isAuthenticated = false;

  publicNav = PUBLIC_PAGES;

  ngOnInit() {
    this.isAuthenticated = this.tokenService.isLogged();
  }
} 

