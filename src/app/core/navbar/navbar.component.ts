import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass'],
})
export class NavbarComponent implements OnInit {
  currentLink: string = 'home';
  constructor() {}

  ngOnInit(): void {
    document.querySelectorAll('.sidebar-link').forEach((l) => {
      l.addEventListener('click', (e) => {
        this.currentLink = (e.target as HTMLElement).id;
      });
    });
  }
}
