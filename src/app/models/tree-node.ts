export class TreeNode {
  public leftNode?: TreeNode;
  public rightNode?: TreeNode;
  public data: number = 0;
  public top = 0;
  public left = 0;
  public id = 0;
  public visited = false;

  public static lastId = 0;

  constructor(data: number, id: number, top = 0, left = 0) {
    this.data = data;
    this.top = top;
    this.left = left;
    this.id = id;
  }

  insert(data: number, autoBalance: boolean = false): TreeNode {
    if (this.data > data) {
      if (this.leftNode !== undefined) {
        this.leftNode = this.leftNode.insert(data, autoBalance);

        //if (autoBalance) this = this.balanceTree(this);
      } else {
        this.leftNode = new TreeNode(data, TreeNode.lastId + 1);
        TreeNode.lastId = TreeNode.lastId + 1;
      }
    } else {
      if (this.rightNode !== undefined) {
        this.rightNode = this.rightNode.insert(data, autoBalance);

        //if (autoBalance) this = this.balanceTree(this);
      } else {
        this.rightNode = new TreeNode(data, TreeNode.lastId + 1);
        TreeNode.lastId = TreeNode.lastId + 1;
      }
    }

    return this;
  }

  dfs(nodesVisited: TreeNode[]) {
    if (this.leftNode !== undefined) {
      nodesVisited.push(this.leftNode);
      this.leftNode.dfs(nodesVisited);
    }

    if (this.rightNode !== undefined) {
      nodesVisited.push(this.rightNode);
      this.rightNode.dfs(nodesVisited);
    }
  }

  balanceTree(node: TreeNode): TreeNode {
    const balancedFactor = this.balanceFactor(node);

    if (balancedFactor > 1) {
      if (
        node.leftNode !== undefined &&
        this.balanceFactor(node.leftNode) > 0
      ) {
        node = this.rotateLL(node);
      } else {
        node = this.rotateLR(node);
      }
    } else if (balancedFactor < -1) {
      if (
        node.rightNode !== undefined &&
        this.balanceFactor(node.rightNode) > 0
      ) {
        node = this.rotateRL(node);
      } else {
        node = this.rotateRR(node);
      }
    }
    return node;
  }

  balanceFactor(node: TreeNode) {
    return this.getHeight(node.leftNode) - this.getHeight(node.rightNode);
  }

  getHeight(node: TreeNode | undefined) {
    let height = 0;
    if (node !== undefined) {
      const l = this.getHeight(node.leftNode);
      const r = this.getHeight(node.rightNode);
      height = Math.max(l, r) + 1;
    }
    return height;
  }

  rotateRR(parent: TreeNode) {
    let pivot = parent.rightNode!;
    parent.rightNode = pivot.leftNode;
    pivot.leftNode = parent;
    return pivot;
  }

  rotateLL(parent: TreeNode): TreeNode {
    let pivot = parent.leftNode!;
    parent.leftNode = pivot.rightNode;
    pivot.rightNode = parent;
    return pivot;
  }

  rotateLR(parent: TreeNode) {
    let pivot = parent.leftNode!;
    parent.leftNode = this.rotateRR(pivot);
    return pivot;
  }

  rotateRL(parent: TreeNode) {
    let pivot = parent.rightNode!;
    parent.rightNode = this.rotateLL(pivot);
    return this.rotateRR(parent);
  }
}
