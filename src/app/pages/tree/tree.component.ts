import { Component, OnInit } from '@angular/core';
import { Tree } from 'src/app/models/tree';
import { TreeNode } from 'src/app/models/tree-node';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.sass'],
})
export class TreeComponent implements OnInit {
  data: number = 0;
  nodes: TreeNode[] = [];

  get height() {
    return this.tree.getHeight();
  }

  constructor(private tree: Tree) {}

  ngOnInit(): void {}

  addToGraph() {
    this.tree.insert(this.data);

    this.nodes = this.tree.draw(1, false, 300);
  }

  treeNodeTrackBy(index: number, treeNode: TreeNode) {
    return treeNode.id;
  }

  dfs() {
    this.tree.dfs().forEach((n, index) => {
      setTimeout(() => {
        this.nodes.filter((n2) => n2.id === n.id)[0].visited = true;
      }, 500 * index);
    });
  }

  bfs() {
    this.tree.bfs().forEach((n, index) => {
      setTimeout(() => {
        this.nodes.filter((n2) => n2.id === n.id)[0].visited = true;
      }, 500 * index);
    });
  }

  reset() {
    this.tree.dfs().forEach((n, index) => {
      this.nodes.filter((n2) => n2.id === n.id)[0].visited = false;
    });
  }
}
