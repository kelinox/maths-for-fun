import Point from './point';

export default interface Node {
  coordinates: Point;
  visited: boolean;
  weight: number;
  distanceToStart: number;
  isStart: boolean;
  isEnd: boolean;
  isInPath: boolean;
  distanceToEnd: number;
  distanceToEndCalculated?: boolean;
  obstacle: boolean;
}
