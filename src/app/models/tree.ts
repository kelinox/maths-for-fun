import { Injectable } from '@angular/core';
import { TreeNode } from './tree-node';

@Injectable()
export class Tree {
  private root?: TreeNode;

  insert(data: number, autoBalance: boolean = false) {
    if (this.root === undefined) {
      this.root = new TreeNode(data, 1);
      TreeNode.lastId = 1;
    } else {
      this.root = this.root.insert(data, autoBalance);
    }
  }

  getHeight() {
    if (this.root === undefined) return 0;

    return this.root.getHeight(this.root);
  }

  draw(level: number, isLeft: boolean, parentLeft: number) {
    return this.getNodes(this.root, level, isLeft, parentLeft);
  }

  getNodes(
    node: TreeNode | undefined,
    level: number,
    isLeft: boolean,
    parentLeft: number
  ): TreeNode[] {
    let nodes: TreeNode[] = [];

    if (node !== undefined) {
      const xOffset = isLeft ? -1 : 1;
      let left = parentLeft + xOffset * this.getSpaceBetweenNode(level);
      nodes.push(new TreeNode(node.data, node.id, level * 45, left));
      level++;
      nodes = nodes.concat(this.getNodes(node.leftNode, level, true, left));
      nodes = nodes.concat(this.getNodes(node.rightNode, level, false, left));
    }

    return nodes;
  }

  dfs() {
    const nodesVisited: TreeNode[] = [];

    if (this.root !== undefined) {
      nodesVisited.push(this.root);
      this.root.dfs(nodesVisited);
    }

    return nodesVisited;
  }

  bfs() {
    const nodesVisited: TreeNode[] = [];
    const nodesToVisit: TreeNode[] = [];

    this.executeBfs(this.root, nodesVisited, nodesToVisit);

    return nodesVisited;
  }

  executeBfs(
    currentNode: TreeNode | undefined,
    nodesVisited: TreeNode[],
    nodesToVisit: TreeNode[]
  ) {
    if (currentNode === undefined) return;

    nodesVisited.push(currentNode);
    if (currentNode.leftNode !== undefined)
      nodesToVisit.push(currentNode.leftNode);

    if (currentNode.rightNode !== undefined)
      nodesToVisit.push(currentNode.rightNode);

    currentNode = nodesToVisit.splice(0, 1)[0];

    this.executeBfs(currentNode, nodesVisited, nodesToVisit);
  }

  private getSpaceBetweenNode(level: number) {
    if (level === 0) return 300;
    else return 200 / level;
  }
}
