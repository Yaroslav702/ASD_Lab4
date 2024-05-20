'use strict';
import Graph from './graph.js';
import GraphDraw from './graphDraw.js';
const n1 = 3;
const n2 = 2;
const n3 = 0;
const n4 = 5;
let k = 1.0 - n3 * 0.01 - n4 * 0.01 - 0.3;

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

const nodeRadius = 25;
const distanceFromCenter = 300;
const amountOfNodes = 10 + n3;
const generator = new Math.seedrandom([n1, n2, n3, n4].join);
let condesationMatrix;

document.addEventListener('keypress', (event) => {
  if (event.code === 'Digit1') {
    console.clear();
    context.clearRect(0, 0, canvas.width, canvas.height);
    const graph = new Graph(amountOfNodes);
    const generator = new Math.seedrandom([n1, n2, n3, n4].join);
    graph.randm(generator);
    graph.mulmr(k);
    const graphDraw = new GraphDraw(canvas, graph, nodeRadius);
    graphDraw.graphDrawTriangle(distanceFromCenter);
    console.log(graph.adjacencyMatrix);
    console.log(graph.getDegreeOfNodes());
    console.log(graph.isRegular());
    console.log(graph.findIsolatedNodes());
    console.log(graph.findLeafNodes());
  }
  if (event.code === 'Digit2') {
    console.clear();
    context.clearRect(0, 0, canvas.width, canvas.height);
    const graph = new Graph(amountOfNodes);
    const generator = new Math.seedrandom([n1, n2, n3, n4].join);
    graph.randm(generator);
    graph.mulmr(k);
    graph.toUndirected();
    const graphDraw = new GraphDraw(canvas, graph, nodeRadius);
    graphDraw.graphDrawTriangle(distanceFromCenter);
    console.log(graph.adjacencyMatrix);
    console.log(graph.getDegreeOfNodes());
    console.log(graph.isRegular());
    console.log(graph.findIsolatedNodes());
    console.log(graph.findLeafNodes());
  }
  if (event.code === 'Digit3') {
    console.clear();
    context.clearRect(0, 0, canvas.width, canvas.height);
    const graph = new Graph(amountOfNodes);
    const generator = new Math.seedrandom([n1, n2, n3, n4].join);
    graph.randm(generator);
    graph.randm(generator);
    k = 1.0 - n3 * 0.005 - n4 * 0.005 - 0.27;
    graph.mulmr(k);
    const graphDraw = new GraphDraw(canvas, graph, nodeRadius);
    graphDraw.graphDrawTriangle(distanceFromCenter);
    console.log(graph.adjacencyMatrix);
    console.log(graph.getDegreeOfNodes());
    console.log(graph.pathsOfSecondLength());
    console.log(graph.pathsOfThirdLength());
    console.log(graph.getReachabilityMatrix());
    console.log(graph.getStronglyConnectedMatrix());
    console.log(graph.findComponents());
    console.log(graph.getCondensationMatrix());
    condesationMatrix = graph.getCondensationMatrix();
  }
  if (event.code === 'Digit4') {
    console.clear();
    context.clearRect(0, 0, canvas.width, canvas.height);
    const graph = new Graph(condesationMatrix.length);
    graph.adjacencyMatrix = condesationMatrix;
    const graphDraw = new GraphDraw(canvas, graph, nodeRadius);
    graphDraw.graphDrawTriangle(distanceFromCenter);
    console.log(graph.adjacencyMatrix);
  }
});
