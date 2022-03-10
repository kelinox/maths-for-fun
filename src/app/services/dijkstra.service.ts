import { Injectable } from '@angular/core';
import Node from '../models/node';
import Point from '../models/point';
import { PathFindingService } from './path-finding.service';

@Injectable()
export class DijkstraService extends PathFindingService {
  execute(
    nodes: Node[][],
    start: Point,
    end: Point,
    columns: number,
    rows: number
  ) {
    this.columns = columns;
    this.rows = rows;
    this.start = start;
    this.end = end;
    this.graph = this.createGraph(nodes);
    this.graph[start.y * this.rows + start.x].distanceToStart = 0;
    let currentNode = this.getClosestNodeToStart(this.graph);
    const endNode = this.graph[end.y * this.rows + end.x];
    const visitedNodes = [];
    let nodesToVisite: Node[] = [];

    while (currentNode !== endNode) {
      var neighbors = this.getNeighbors(currentNode, this.rows, this.columns);
      for (let i = 0; i < neighbors.length; i++) {
        if (start.x !== neighbors[i].x || start.y !== neighbors[i].y) {
          let n = this.graph[neighbors[i].y * this.rows + neighbors[i].x];
          nodesToVisite.push(n);

          if (!n.obstacle && n.distanceToStart === Number.MAX_SAFE_INTEGER)
            this.graph[
              neighbors[i].y * this.rows + neighbors[i].x
            ].distanceToStart =
              currentNode.distanceToStart +
              this.graph[neighbors[i].y * this.rows + neighbors[i].x].weight;
        }
      }
      currentNode.visited = true;
      visitedNodes.push(currentNode);
      currentNode = this.getClosestNodeToStart(nodesToVisite);
      nodesToVisite = removeElement(nodesToVisite, currentNode);
    }

    return visitedNodes;
  }

  /**
   * Create an int[] of all the nodes in the graph
   * @param {int[][]} nodes Array with the row and columns composing the graph
   */
  createGraph(nodes: Node[][]): Node[] {
    var graph = [];
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.columns; col++) {
        graph.push({
          distanceToStart: nodes[row][col].distanceToStart,
          visited: false,
          isStart: nodes[row][col].isStart,
          isEnd: nodes[row][col].isEnd,
          weight: nodes[row][col].weight,
          coordinates: {
            x: nodes[row][col].coordinates.x,
            y: nodes[row][col].coordinates.y,
          },
          isInPath: false,
          distanceToEnd: Number.MAX_SAFE_INTEGER,
          obstacle: nodes[row][col].weight > 150,
        });
      }
    }
    return graph;
  }
}

const removeElement = (array: Node[], elementToRemove: Node): Node[] => {
  const index = array.indexOf(elementToRemove);
  if (index > -1) {
    array.splice(index, 1); // 2nd parameter means remove one item only
  }

  return array;
};
