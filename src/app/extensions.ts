import Node from './models/node';
import Point from './models/point';

export const removeElement = (array: Node[], elementToRemove: Node): Node[] => {
  const index = array.indexOf(elementToRemove);
  if (index > -1) {
    array.splice(index, 1); // 2nd parameter means remove one item only
  }

  return array;
};

/**
 * Get the nodes with the shortest distance to the starting node
 * @param {int[]} nodes The nodes in the graph
 */
export const getClosestNodeToEnd = (nodes: Node[]) =>
  nodes
    .filter((n) => !n.distanceToEndCalculated && !n.obstacle)
    .sort((a, b) => a.distanceToEnd - b.distanceToEnd)[0];

export const getClosestNodeToStart = (nodes: Node[]) =>
  nodes
    .filter((n) => !n.visited && !n.obstacle)
    .sort((a, b) => {
      if (a.distanceToStart < b.distanceToStart) {
        return -1;
      }

      return 1;
    })[0];
export const getClosestNodeToStartWithEndDistance = (nodes: Node[]) =>
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

/**
 * Get the coordinates of all the neighbors for a given node
 * @param {any} node Current node
 */
export const getNeighbors = (
  node: Node,
  rows: number,
  columns: number
): Point[] => {
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
  } else if (node.coordinates.y === 0 && node.coordinates.x === maxX) {
    return [
      { x: node.coordinates.x - 1, y: node.coordinates.y },
      { x: node.coordinates.x, y: node.coordinates.y + 1 },
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
};

/**
 * Get the path from the starting node to the ending node
 */
export const getPathFromStartToEnd = (
  nodes: Node[][],
  start: Point,
  end: Point,
  nbRows: number,
  nbColumns: number
) => {
  let currentNode = nodes[end.y][end.x];

  if (!currentNode.visited) return [];

  let startNode = nodes[start.y][start.x];
  const path: Node[] = [];

  while (currentNode !== startNode) {
    if (!currentNode.obstacle) path.push(currentNode);

    currentNode = getClosestNeighbor(nodes, currentNode, nbRows, nbColumns);
  }

  return path;
};
/**
 * Retrieve the node with the shortest distance to the starting point for a given node
 * @param {int[]} nodes All nodes in the graph
 * @param {any} node Current node
 */
export const getClosestNeighbor = (
  nodes: Node[][],
  node: Node,
  nbRows: number,
  nbColumns: number
) => {
  const neighbors = getNeighbors(node, nbRows, nbColumns);
  let closest = nodes[neighbors[0].y][neighbors[0].x];
  for (let i = 1; i < neighbors.length; i++) {
    const currentNode = nodes[neighbors[i].y][neighbors[i].x];
    if (closest.distanceToStart > currentNode.distanceToStart)
      closest = nodes[neighbors[i].y][neighbors[i].x];
  }

  return closest;
};

export const setDistanceToStart = (
  nodes: Node[][],
  neighbor: Point,
  start: Point,
  distanceToStart: number
) => {
  let n = nodes[neighbor.y][neighbor.x];
  if (start.x !== neighbor.x || start.y !== neighbor.y) {
    if (!n.obstacle && n.distanceToStart === Number.MAX_SAFE_INTEGER)
      n.distanceToStart = distanceToStart + n.weight;
  }

  return n;
};

export const hasBeenVisited = (node: Node): Node => {
  node.visited = true;
  return node;
};
