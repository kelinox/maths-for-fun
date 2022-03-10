import { Component, Input, OnInit } from '@angular/core';
import Node from 'src/app/models/node';

@Component({
  selector: 'app-grid-item',
  templateUrl: './grid-item.component.html',
  styleUrls: ['./grid-item.component.sass'],
})
export class GridItemComponent implements OnInit {
  @Input() node!: Node;

  constructor() {}

  ngOnInit(): void {}
}
