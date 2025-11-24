import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { Usuario } from '../../../models/Usuario';
import { Usuarioservice } from '../../../services/usuarioservice';

@Component({
  selector: 'app-usuariolistar',
  standalone: true,
  imports: [MatTableModule, MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './usuariolistar.html',
  styleUrl: './usuariolistar.css',
})
export class Usuariolistar implements OnInit {
  dataSource: MatTableDataSource<Usuario> = new MatTableDataSource();
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7'];

  constructor(private uS: Usuarioservice) {}

  ngOnInit(): void {
    this.uS.list().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });
    this.uS.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });
  }

  eliminar(id: number) {
    this.uS.delete(id).subscribe(() => {
      this.uS.list().subscribe((data) => {
        this.uS.setList(data);
      });
    });
  }
}
