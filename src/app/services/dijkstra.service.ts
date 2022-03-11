import { Injectable } from '@angular/core';
import {
  removeElement,
  getClosestNodeToStart,
  getNeighbors,
  setDistanceToStart,
  hasBeenVisited,
} from '../extensions';
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
    const tmpNodes: Node[][] = JSON.parse(JSON.stringify(nodes));
    this.columns = columns;
    this.rows = rows;
    this.start = start;
    this.end = end;
    tmpNodes[start.y][start.x].distanceToStart = 0;
    let currentNode = tmpNodes[start.y][start.x];
    const endNode = tmpNodes[end.y][end.x];
    const visitedNodes = [];
    let nodesToVisite: Node[] = [];

    while (currentNode !== endNode && currentNode !== undefined) {
      var neighbors = getNeighbors(currentNode, this.rows, this.columns);
      for (let i = 0; i < neighbors.length; i++) {
        const node = setDistanceToStart(
          tmpNodes,
          neighbors[i],
          start,
          currentNode.distanceToStart
        );
        tmpNodes[neighbors[i].y][neighbors[i].x] = node;

        if (!node.obstacle && nodesToVisite.indexOf(node) === -1)
          nodesToVisite.push(node);
      }

      currentNode = hasBeenVisited(currentNode);
      visitedNodes.push(currentNode);
      currentNode = getClosestNodeToStart(nodesToVisite);
      nodesToVisite = removeElement(nodesToVisite, currentNode);
    }

    if (currentNode === endNode)
      nodes[end.y][end.x] = hasBeenVisited(nodes[end.y][end.x]);

    return visitedNodes;
  }
}
