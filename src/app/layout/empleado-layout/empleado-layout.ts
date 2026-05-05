import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { Sidebar } from '../../shared/components/sidebar/sidebar';


@Component({
  selector: 'app-empleado-layout',
  standalone: true,
  imports: [RouterOutlet,Sidebar],
  templateUrl: './empleado-layout.html',
  styleUrl: './empleado-layout.css',
})
export class EmpleadoLayout {

  

}
