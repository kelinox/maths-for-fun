import { Injectable } from '@angular/core';
import {
  removeElement,
  getClosestNodeToEnd,
  getClosestNodeToStartWithEndDistance,
  getNeighbors,
  setDistanceToStart,
} from '../extensions';
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
    const tmpNodes: Node[][] = JSON.parse(JSON.stringify(nodes));
    this.columns = columns;
    this.rows = rows;
    this.start = start;
    this.end = end;
    tmpNodes[start.y][start.x].distanceToStart = 0;
    tmpNodes[end.y][end.x].distanceToEnd = 0;
    this.calculateDistanceToEnd(tmpNodes);

    let currentNode = tmpNodes[start.y][start.x];
    const endNode = tmpNodes[end.y][end.x];
    const visitedNodes: Node[] = [];
    let nodesToVisite: Node[] = [];

    while (
      currentNode !== endNode &&
      !visitedNodes.includes(currentNode) &&
      currentNode !== undefined
    ) {
      var neighbors = getNeighbors(currentNode, this.rows, this.columns);

      for (let i = 0; i < neighbors.length; i++) {
        const node = setDistanceToStart(
          tmpNodes,
          neighbors[i],
          start,
          currentNode.distanceToStart
        ); //
        tmpNodes[neighbors[i].y][neighbors[i].x] = node;

        if (
          !node.obstacle &&
          nodesToVisite.find(
            (n) =>
              n.coordinates.x === node.coordinates.x &&
              n.coordinates.y === node.coordinates.y
          ) === undefined
        )
          nodesToVisite.push(node);
      }

      currentNode.visited = true;
      visitedNodes.push(currentNode);
      currentNode = getClosestNodeToStartWithEndDistance(nodesToVisite);
      nodesToVisite = removeElement(nodesToVisite, currentNode);
    }

    if (currentNode === endNode) nodes[end.y][end.x].visited = true;

    return visitedNodes;
  }

  private calculateDistanceToEnd(nodes: Node[][]) {
    let currentNode = nodes[this.end.y][this.end.x];
    let nodeToVisit: Node[] = [];

    while (currentNode !== undefined) {
      var neighbors = getNeighbors(currentNode, this.rows, this.columns);

      for (let i = 0; i < neighbors.length; i++) {
        if (this.end.x !== neighbors[i].x || this.end.y !== neighbors[i].y) {
          let n = nodes[neighbors[i].y][neighbors[i].x];
          nodeToVisit.push(n);
          if (n.distanceToEnd === Number.MAX_SAFE_INTEGER) {
            n.distanceToEnd = currentNode.distanceToEnd + n.weight;
          }
        }
      }

      currentNode.distanceToEndCalculated = true;
      currentNode = getClosestNodeToEnd(nodeToVisit);
      nodeToVisit = removeElement(nodeToVisit, currentNode);
    }
  }
}
