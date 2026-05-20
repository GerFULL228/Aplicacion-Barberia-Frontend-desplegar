import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-public-layout',
  imports: [RouterOutlet, FooterComponent, HeaderComponent],
  template: `
  <app-header/>
    <main class="min-h-screen pt-20 sm:pt-[88px]">
      <router-outlet></router-outlet>
    </main>
  <app-footer/>`,})
export class PublicLayoutComponent {

}
