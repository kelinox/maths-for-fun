import { Injectable, NgModule } from '@angular/core';
import Node from '../models/node';
import Point from '../models/point';
import { PathFindingService } from './path-finding.service';

@Injectable()
export class AStarService extends PathFindingService {
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
    this.graph = createGraph(nodes, this.rows, this.columns);
    this.graph[start.y * this.rows + start.x].distanceToStart = 0;
    this.graph[end.y * this.rows + end.x].distanceToEnd = 0;
    this.calculateDistanceToEnd();

    let currentNode = this.graph[start.y * this.rows + start.x];
    const endNode = this.graph[end.y * this.rows + end.x];
    const visitedNodes: Node[] = [];
    let nodesToVisite: Node[] = [];

    while (currentNode !== endNode && !visitedNodes.includes(currentNode)) {
      var neighbors = this.getNeighbors(currentNode, this.rows, this.columns);

      for (let i = 0; i < neighbors.length; i++) {
        if (start.x !== neighbors[i].x || start.y !== neighbors[i].x) {
          let n = this.graph[neighbors[i].y * this.rows + neighbors[i].x];
          nodesToVisite.push(n);

          if (!n.obstacle && n.distanceToStart === Number.MAX_SAFE_INTEGER)
            n.distanceToStart = currentNode.distanceToStart + n.weight;
        }
      }

      currentNode.visited = true;
      visitedNodes.push(currentNode);
      currentNode = getClosestNodeToStart(nodesToVisite);
      nodesToVisite = removeElement(nodesToVisite, currentNode);
    }

    return visitedNodes;
  }

  private calculateDistanceToEnd() {
    let currentNode = this.graph[this.end.y * this.rows + this.end.x];

    while (currentNode !== undefined) {
      var neighbors = this.getNeighbors(currentNode, this.rows, this.columns);

      for (let i = 0; i < neighbors.length; i++) {
        if (this.end.x !== neighbors[i].x || this.end.y !== neighbors[i].y) {
          let n = this.graph[neighbors[i].y * this.rows + neighbors[i].x];
          if (n.distanceToEnd === Number.MAX_SAFE_INTEGER) {
            n.distanceToEnd = currentNode.distanceToEnd + n.weight;
          }
        }
      }

      currentNode.distanceToEndCalculated = true;
      currentNode = this.getClosestNodeToEnd(this.graph);
    }
  }
}

const getClosestNodeToStart = (nodes: Node[]) =>
  nodes
    .filter((n) => !n.visited && !n.obstacle)
    .sort((a, b) => {
      if (
        a.distanceToStart + a.distanceToEnd <
        b.distanceToStart + b.distanceToEnd
      ) {
        return -1;
      }

      return 1;
    })[0];

const createGraph = (
  nodes: Node[][],
  nbRows: number,
  nbColumns: number
): Node[] => {
  var graph = [];
  for (let row = 0; row < nbRows; row++) {
    for (let col = 0; col < nbColumns; col++) {
      graph.push({
        visited: false,
        isStart: nodes[row][col].isStart,
        isEnd: nodes[row][col].isEnd,
        weight: nodes[row][col].weight,
        coordinates: {
          x: nodes[row][col].coordinates.x,
          y: nodes[row][col].coordinates.y,
        },
        isInPath: false,
        distanceToStart: nodes[row][col].distanceToStart,
        distanceToEnd: nodes[row][col].distanceToEnd,
        distanceToEndCalculated: false,
        obstacle: nodes[row][col].weight > 150,
      });
    }
  }

  return graph;
};

const removeElement = (array: Node[], elementToRemove: Node): Node[] => {
  const index = array.indexOf(elementToRemove);
  if (index > -1) {
    array.splice(index, 1); // 2nd parameter means remove one item only
  }

  return array;
};
