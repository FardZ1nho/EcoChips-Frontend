import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Retolistar } from './retolistar/retolistar';

@Component({
  selector: 'app-reto',
  imports: [RouterOutlet, Retolistar],
  templateUrl: './reto.html',
  styleUrl: './reto.css',
})
export class Reto {
  constructor(public route:ActivatedRoute){}
}