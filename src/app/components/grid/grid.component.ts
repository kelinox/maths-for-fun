import { Component, Input, OnInit } from '@angular/core';
import Node from 'src/app/models/node';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.sass'],
})
export class GridComponent implements OnInit {
  @Input() nodes: Node[][] = [];

  constructor() {}

  ngOnInit(): void {}
}
