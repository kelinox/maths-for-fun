import { Component, OnInit } from '@angular/core';
import { getPathFromStartToEnd } from 'src/app/extensions';
import Node from 'src/app/models/node';
import Point from 'src/app/models/point';
import { AStarService } from 'src/app/services/a-star.service';
import { DijkstraService } from 'src/app/services/dijkstra.service';

@Component({
  selector: 'app-pathfinding',
  templateUrl: './pathfinding.component.html',
  styleUrls: ['./pathfinding.component.sass'],
})
export class PathfindingComponent implements OnInit {
  columns = 20;
  rows = 20;
  get start(): Point {
    return { x: this.startX, y: this.startY };
  }
  startX = 0;
  startY = 0;
  endX = 19;
  endY = 19;
  get end(): Point {
    return { x: this.endX, y: this.endY };
  }
  nodes: Node[][] = [];
  hasWeight = false;
  running = false;
  timeouts: any[] = [];
  algo: string = '';
  animation = true;

  constructor(
    private readonly dijkstraService: DijkstraService,
    private readonly aStarService: AStarService
  ) {}

  ngOnInit(): void {}

  initNodes() {
    this.resetTimeout();
    this.nodes = [];
    for (let i = 0; i < this.rows; i++) {
      const currentRow: Node[] = [];
      for (let j = 0; j < this.columns; j++) {
        const isStart = this.start.x === j && this.start.y === i;
        const isEnd = this.end.x === j && this.end.y === i;
        const weight = this.getWeight(j, i);
        currentRow.push({
          coordinates: { x: j, y: i },
          visited: false,
          weight: weight,
          distanceToStart: Number.MAX_SAFE_INTEGER,
          isStart,
          isEnd,
          isInPath: false,
          distanceToEnd: Number.MAX_SAFE_INTEGER,
          obstacle: weight > 150,
        });
      }
      this.nodes.push(currentRow);
    }
  }

  startPathFinding() {
    switch (this.algo) {
      case 'dijkstra':
        this.startDijkstra();
        break;
      case 'a-star':
        this.startAStar();
        break;
      default:
        break;
    }
  }

  stopPathFinding() {
    this.resetTimeout();
    this.resetNodes();
    this.running = false;
  }

  private startDijkstra() {
    this.running = true;
    this.resetTimeout();
    this.resetNodes();
    var visitedNodes = this.dijkstraService.execute(
      this.nodes,
      this.start,
      this.end,
      this.columns,
      this.rows
    );
    this.showVisitedNodes(visitedNodes);
  }

  private startAStar() {
    this.running = true;
    this.resetTimeout();
    this.resetNodes();
    var visitedNodes = this.aStarService.execute(
      this.nodes,
      this.start,
      this.end,
      this.columns,
      this.rows
    );
    this.showVisitedNodes(visitedNodes);
  }

  private getWeight(x: number, y: number): number {
    const isStart = this.start.x === x && this.start.y === y;
    const isEnd = this.end.x === x && this.end.y === y;
    return isStart || isEnd || !this.hasWeight
      ? 1
      : Math.floor(Math.random() * (200 - 1 + 1)) + 1;
  }

  private showVisitedNodes(visitedNodes: Node[]) {
    for (let i = 0; i < visitedNodes.length; i++) {
      if (this.animation) {
        const t = setTimeout(() => {
          this.nodes[visitedNodes[i].coordinates.y][
            visitedNodes[i].coordinates.x
          ] = visitedNodes[i];

          if (i === visitedNodes.length - 1) this.getPathFromStartToEnd();
        }, 1 * i);
        this.timeouts.push(t);
      } else {
        this.nodes[visitedNodes[i].coordinates.y][
          visitedNodes[i].coordinates.x
        ] = visitedNodes[i];
      }
    }

    if (!this.animation) {
      this.getPathFromStartToEnd();
    }
  }

  private getPathFromStartToEnd() {
    let path: Node[] = getPathFromStartToEnd(
      this.nodes,
      this.start,
      this.end,
      this.rows,
      this.columns
    );
    for (let i = path.length - 1; i >= 0; i--) {
      if (this.animation) {
        const t = setTimeout(() => {
          this.nodes[path[i].coordinates.y][path[i].coordinates.x].isInPath =
            true;

          if (i === 0) this.running = false;
        }, 100 * (i - path.length));
        this.timeouts.push(t);
      } else {
        this.nodes[path[i].coordinates.y][path[i].coordinates.x].isInPath =
          true;
      }
    }

    if (path.length === 0 || !this.animation) this.running = false;
  }

  private resetNodes() {
    this.nodes.forEach((r) =>
      r.forEach(
        (n) => (
          (n.visited = false),
          (n.isInPath = false),
          (n.distanceToStart = Number.MAX_SAFE_INTEGER),
          (n.distanceToEndCalculated = false),
          (n.distanceToEnd = Number.MAX_SAFE_INTEGER)
        )
      )
    );
  }

  private resetTimeout() {
    for (let i = 0; i < this.timeouts.length; i++) {
      const t = this.timeouts[i];
      clearTimeout(t);
    }

    this.timeouts = [];
  }
}
