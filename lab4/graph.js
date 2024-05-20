'use strict';
export default class Graph {
  constructor(numberNodes) {
    this.numberNodes = numberNodes;
    this.adjacencyMatrix = [];
    this.isDirected = true;
    for (let i = 0; i < this.numberNodes; i++) {
      this.adjacencyMatrix[i] = new Array(this.numberNodes).fill(0);
    }
  }
  randm(generator) {
    for (const arr of this.adjacencyMatrix) {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = generator() * 2;
      }
    }
  }
  mulmr(k) {
    for (const arr of this.adjacencyMatrix) {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = arr[i] * k >= 1 ? 1 : 0;
      }
    }
  }
  toUndirected() {
    const matrix = this.adjacencyMatrix;
    const oldMatrix = [];
    for (let i = 0; i < matrix.length; i++) {
      oldMatrix[i] = matrix[i].slice();
    }
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix.length; j++) {
        if (matrix[i][j] === 1) matrix[j][i] = matrix[i][j];
      }
    }
    this.isDirected = !this.isDirected;
    return oldMatrix;
  }
  getDegreeOfNodes() {
    const res = [];
    const matrix = this.adjacencyMatrix;
    for (let i = 0; i < matrix.length; i++) {
      let counter1 = 0;
      let counter2 = 0;
      for (let j = 0; j < matrix.length; j++) {
        if (matrix[i][j] === 1) {
          counter1++;
          if (i === j && !this.isDirected) {
            counter1++;
          }
        }
        if (matrix[j][i] === 1) {
          counter2++;
        }
      }
      if (this.isDirected) res.push([counter1 + counter2, counter1, counter2]);
      else res.push([counter1]);
    }
    return res;
  }
  isRegular() {
    const arr = this.getDegreeOfNodes();
    const temp = arr[0][0];
    for (const [el] of arr) {
      if (el !== temp) {
        return false;
      }
    }
    return temp;
  }
  findIsolatedNodes() {
    const arr = this.getDegreeOfNodes();
    const isolatedNodes = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i][0] === 0) {
        isolatedNodes.push(i);
      }
    }
    return isolatedNodes;
  }
  findLeafNodes() {
    const arr = this.getDegreeOfNodes();
    const leafNodes = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i][0] === 1) {
        leafNodes.push(i);
      }
    }
    return leafNodes;
  }
  multiplyMatrix(matrix1, matrix2) {
    let resultMatrix = [];
    for (let i = 0; i < matrix1.length; i++) {
      resultMatrix[i] = new Array(matrix1.length).fill(0);
    }
    for (let k = 0; k < matrix1.length; k++) {
      for (let i = 0; i < matrix1.length; i++) {
        for (let j = 0; j < matrix1.length; j++) {
          resultMatrix[k][i] += matrix1[k][j] * matrix2[j][i];
        }
      }
    }
    return resultMatrix;
  }
  pathsOfSecondLength() {
    const matrix = [];
    const paths = [];
    for (let i = 0; i < this.adjacencyMatrix.length; i++) {
      matrix[i] = [...this.adjacencyMatrix[i]];
    }
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix.length; j++) {
        if (matrix[i][j] === 1) {
          for (let k = 0; k < matrix.length; k++) {
            if (matrix[j][k] === 1) {
              paths.push([i, j, k]);
            }
          }
        }
      }
    }
    return paths;
  }
  pathsOfThirdLength() {
    const matrix = [];
    const paths = [];
    for (let i = 0; i < this.adjacencyMatrix.length; i++) {
      matrix[i] = [...this.adjacencyMatrix[i]];
    }
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix.length; j++) {
        if (matrix[i][j] === 1) {
          for (let k = 0; k < matrix.length; k++) {
            if (matrix[j][k] === 1) {
              for (let x = 0; x < matrix.length; x++) {
                if (matrix[k][x] === 1) {
                  paths.push([i, j, k, x]);
                }
              }
            }
          }
        }
      }
    }
    return paths;
  }
  getReachabilityMatrix() {
    const matrix = this.adjacencyMatrix;
    let reachabilityMatrix = [];
    for (let i = 0; i < matrix.length; i++) {
      reachabilityMatrix[i] = [...matrix[i]];
    }
    for (let k = 0; k < matrix.length; k++) {
      for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix.length; j++) {
          reachabilityMatrix[i][j] = reachabilityMatrix[i][j] || (reachabilityMatrix[i][k] && reachabilityMatrix[k][j]);
        }
      }
    }
    return reachabilityMatrix;
  }
  getStronglyConnectedMatrix() {
    const matrix = this.adjacencyMatrix;
    const stronglyConnectedMatrix = this.getReachabilityMatrix();
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix.length; j++) {
        stronglyConnectedMatrix[i][j] *= stronglyConnectedMatrix[j][i];
      }
    }
    return stronglyConnectedMatrix;
  }
  makeAdjList(adjMatrix) {
    const adjList = [];
    for (let i = 0; i < adjMatrix.length; i++) {
      adjList[i] = [];
    }
    for (let i = 0; i < adjMatrix.length; i++) {
      for (let j = 0; j < adjMatrix.length; j++) {
        if (adjMatrix[i][j] === 1) {
          adjList[i].push(j);
        }
      }
    }
    return adjList;
  }
  dfs(curr, des, adj, vis = []) {
    // If the current node is the destination, return true
    if (curr === des) {
      return true;
    }
    vis[curr] = 1;
    for (let x of adj[curr]) {
      if (!vis[x]) {
        if (this.dfs(x, des, adj, vis)) {
          return true;
        }
      }
    }
    return false;
  }
  isPath(src, des, adj) {
    const vis = new Array(adj.length + 1).fill(0);
    return this.dfs(src, des, adj, vis);
  }
  findComponents() {
    const n = this.adjacencyMatrix.length;
    const ans = [];
    const is_scc = new Array(n + 1).fill(0);
    const adjList = this.makeAdjList(this.adjacencyMatrix);
    for (let i = 0; i < n; i++) {
      if (!is_scc[i]) {
        const scc = [i];
        for (let j = i + 1; j < n; j++) {
          if (!is_scc[j] && this.isPath(i, j, adjList) && this.isPath(j, i, adjList)) {
            is_scc[j] = 1;
            scc.push(j);
          }
        }
        ans.push(scc);
      }
    }
    return ans;
  }
  getCondensationMatrix() {
    const components = this.findComponents();
    const countOfVertices = components.length;
    const adjList = this.makeAdjList(this.adjacencyMatrix);
    const condensationMatrix = Array.from({ length: countOfVertices }, () => Array(countOfVertices).fill(0));
    const order = [];
    for (let k = 0; k < countOfVertices; k++) {
      for (let i = 0; i < countOfVertices; i++) {
        let counter = k;
        for (let j = 0; j < countOfVertices; j++) {
          if (this.isPath(components[i][0], components[j][0], adjList)) {
            counter++;
          }
        }
        if (counter === countOfVertices) {
          order.push(i);
        }
      }
    }
    for (let i = 0; i < countOfVertices - 1; i++) {
      condensationMatrix[order[i]][order[i + 1]] = 1;
    }
    return condensationMatrix;
  }
}
