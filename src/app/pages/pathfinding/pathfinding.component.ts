import { Component, OnInit } from '@angular/core';
import { getPathFromStartToEnd } from 'src/app/extensions';
import { Graph } from 'src/app/models/graph';
import Node from 'src/app/models/node';
import Point from 'src/app/models/point';
import { AStarService } from 'src/app/services/a-star.service';

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
  get nodes(): Node[][] {
    return this.graph.getNodes();
  }

  hasWeight = false;
  running = false;
  timeouts: any[] = [];
  algo: string = '';
  animation = true;

  constructor(private graph: Graph) {}

  ngOnInit(): void {}

  initNodes() {
    this.graph = this.graph.generate(
      this.rows,
      this.columns,
      this.start,
      this.end,
      this.hasWeight
    );
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
    this.running = false;
  }

  private startDijkstra() {
    this.running = true;
    this.resetTimeout();
    this.graph = this.graph
      .resetNodes()
      .executeDijkstra(this.rows, this.columns, this.start, this.end)
      .showVisitedNodes(this.showVisitedNodes, this);
  }

  private startAStar() {
    this.running = true;
    this.resetTimeout();
    this.graph = this.graph
      .resetNodes()
      .executeAStar(this.rows, this.columns, this.start, this.end)
      .showVisitedNodes(this.showVisitedNodes, this);
  }

  private showVisitedNodes(visitedNodes: Node[], self: PathfindingComponent) {
    for (let i = 0; i < visitedNodes.length; i++) {
      if (self.animation) {
        const t = setTimeout(() => {
          self.graph = self.graph.updateNode(
            visitedNodes[i].coordinates.x,
            visitedNodes[i].coordinates.y,
            visitedNodes[i]
          );

          if (i === visitedNodes.length - 1) self.showPathFromStartToEnd();
        }, 1 * i);
        self.timeouts.push(t);
      } else {
        self.graph = self.graph.updateNode(
          visitedNodes[i].coordinates.x,
          visitedNodes[i].coordinates.y,
          visitedNodes[i]
        );
      }
    }

    if (!self.animation) {
      self.showPathFromStartToEnd();
    }
  }

  private showPathFromStartToEnd() {
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

  private resetTimeout() {
    for (let i = 0; i < this.timeouts.length; i++) {
      const t = this.timeouts[i];
      clearTimeout(t);
    }

    this.timeouts = [];
  }
}
