import Point from '../models/point';
import Node from '../models/node';

export class PathFindingService {
  start: Point = { x: 0, y: 0 };
  end: Point = { x: 0, y: 0 };
  columns: number = 40;
  rows: number = 40;
  graph: Node[] = [];
  /**
   * Get the path from the starting node to the ending node
   */
  getPathFromStartToEnd() {
    let currentNode = this.graph[this.end.y * this.rows + this.end.x];
    let startNode = this.graph[this.start.y * this.rows + this.start.x];
    const path = [];

    while (currentNode !== startNode) {
      path.push(currentNode);

      currentNode = this.getClosestNeighbor(
        this.graph,
        currentNode,
        this.rows,
        this.columns
      );
    }

    return path;
  }

  /**
   * Retrieve the node with the shortest distance to the starting point for a given node
   * @param {int[]} nodes All nodes in the graph
   * @param {any} node Current node
   */
  getClosestNeighbor(
    nodes: Node[],
    node: Node,
    nbRows: number,
    nbColumns: number
  ) {
    const neighbors = this.getNeighbors(node, nbRows, nbColumns);
    let closest = nodes[neighbors[0].y * nbRows + neighbors[0].x];
    for (let i = 1; i < neighbors.length; i++) {
      const currentNode = nodes[neighbors[i].y * nbRows + neighbors[i].x];
      if (closest.distanceToStart > currentNode.distanceToStart)
        closest = nodes[neighbors[i].y * nbRows + neighbors[i].x];
    }

    return closest;
  }

  /**
   * Get the nodes with the shortest distance to the starting node
   * @param {int[]} nodes The nodes in the graph
   */
  getClosestNodeToEnd(nodes: Node[]) {
    return nodes
      .filter((n) => !n.distanceToEndCalculated && !n.obstacle)
      .sort((a, b) => a.distanceToEnd - b.distanceToEnd)[0];
  }

  /**
   * Get the nodes with the shortest distance to the starting node
   * @param {int[]} nodes The nodes in the graph
   */
  getClosestNodeToStart(nodes: Node[]) {
    return nodes
      .filter((n) => !n.visited && !n.obstacle)
      .sort((a, b) => (a.distanceToStart < b.distanceToStart ? -1 : 1))[0];
  }

  /**
   * Get the coordinates of all the neighbors for a given node
   * @param {any} node Current node
   */
  getNeighbors(node: Node, rows: number, columns: number): Point[] {
    const maxY = rows - 1;
    const maxX = columns - 1;
    if (node.coordinates.y === 0 && node.coordinates.x === 0) {
      return [
        { x: node.coordinates.x + 1, y: node.coordinates.y },
        { x: node.coordinates.x, y: node.coordinates.y + 1 },
      ];
    } else if (node.coordinates.x === 0 && node.coordinates.y === maxY) {
      return [
        { x: node.coordinates.x + 1, y: node.coordinates.y },
        { x: node.coordinates.x, y: node.coordinates.y - 1 },
      ];
    } else if (node.coordinates.y === 0) {
      return [
        { x: node.coordinates.x + 1, y: node.coordinates.y },
        { x: node.coordinates.x - 1, y: node.coordinates.y },
        { x: node.coordinates.x, y: node.coordinates.y + 1 },
      ];
    } else if (node.coordinates.x === 0) {
      return [
        { x: node.coordinates.x + 1, y: node.coordinates.y },
        { x: node.coordinates.x, y: node.coordinates.y - 1 },
        { x: node.coordinates.x, y: node.coordinates.y + 1 },
      ];
    } else if (node.coordinates.x == maxX && node.coordinates.y == maxY) {
      return [
        { x: node.coordinates.x - 1, y: node.coordinates.y },
        { x: node.coordinates.x, y: node.coordinates.y - 1 },
      ];
    } else if (node.coordinates.y === maxY) {
      return [
        { x: node.coordinates.x + 1, y: node.coordinates.y },
        { x: node.coordinates.x - 1, y: node.coordinates.y },
        { x: node.coordinates.x, y: node.coordinates.y - 1 },
      ];
    } else if (node.coordinates.x === maxX) {
      return [
        { x: node.coordinates.x - 1, y: node.coordinates.y },
        { x: node.coordinates.x - 1, y: node.coordinates.y + 1 },
        { x: node.coordinates.x, y: node.coordinates.y - 1 },
      ];
    }

    return [
      { x: node.coordinates.x + 1, y: node.coordinates.y },
      { x: node.coordinates.x - 1, y: node.coordinates.y },
      { x: node.coordinates.x, y: node.coordinates.y - 1 },
      { x: node.coordinates.x, y: node.coordinates.y + 1 },
    ];
  }
}
