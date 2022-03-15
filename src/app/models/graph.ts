import { Injectable } from '@angular/core';
import { PathfindingComponent } from '../pages/pathfinding/pathfinding.component';
import { AStarService } from '../services/a-star.service';
import { DijkstraService } from '../services/dijkstra.service';
import Node from './node';
import Point from './point';

@Injectable()
export class Graph {
  private nodes: Node[][] = [];
  private visitedNodes: Node[] = [];
  constructor(
    private readonly dijkstra: DijkstraService,
    private readonly aStar: AStarService
  ) {}

  public getNodes() {
    return this.nodes;
  }

  public updateNode(x: number, y: number, value: Node): Graph {
    this.nodes[y][x] = value;

    return this;
  }

  public generate(
    rows: number,
    columns: number,
    start: Point,
    end: Point,
    withWeight: boolean = false
  ): Graph {
    this.nodes = [];
    for (let i = 0; i < rows; i++) {
      const currentRow: Node[] = [];
      for (let j = 0; j < columns; j++) {
        const isStart = start.x === j && start.y === i;
        const isEnd = end.x === j && end.y === i;
        const weight = withWeight ? this.getWeight(isStart, isEnd) : 1;
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

    return this;
  }

  public executeDijkstra(
    rows: number,
    columns: number,
    start: Point,
    end: Point
  ): Graph {
    this.visitedNodes = this.dijkstra.execute(
      this.nodes,
      start,
      end,
      columns,
      rows
    );

    return this;
  }

  public executeAStar(rows: number, columns: number, start: Point, end: Point) {
    this.visitedNodes = this.aStar.execute(
      this.nodes,
      start,
      end,
      columns,
      rows
    );

    return this;
  }

  public resetNodes(): Graph {
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

    return this;
  }

  public showVisitedNodes(callback: any, self: PathfindingComponent): Graph {
    callback(this.visitedNodes, self);

    return this;
  }

  private getWeight(isStart: boolean, isEnd: boolean): number {
    return isStart || isEnd ? 1 : Math.floor(Math.random() * (200 - 1 + 1)) + 1;
  }
}
