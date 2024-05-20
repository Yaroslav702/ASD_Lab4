'use strict';
export default class GraphDraw {
  constructor(canvas, graph, nodeRadius) {
    this.canvas = canvas;
    this.graph = graph;
    this.nodeRadius = nodeRadius;
    this.nodes = new Array(nodeRadius).fill(0);
    this.context = this.canvas.getContext('2d');
  }
  getDistance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
  }
  drawNode(x, y, color = '#c7c21a', text = '') {
    this.context.beginPath();
    this.context.strokeStyle = 'black';
    this.context.fillStyle = color;
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    this.context.font = '30px comic-sans';
    this.context.lineWidth = 5;
    this.context.arc(x, y, this.nodeRadius, 0, Math.PI * 2, false);
    this.context.fill();
    this.context.fillStyle = 'black';
    this.context.fillText(text, x, y);
    this.context.stroke();
    this.context.strokeStyle = 'black';
    this.context.closePath();
  }

  drawArrow(x, y, angle, headLength, color = 'black') {
    this.context.strokeStyle = color;
    this.context.lineTo(x - headLength * Math.cos(angle - Math.PI / 6), y - headLength * Math.sin(angle - Math.PI / 6));
    this.context.moveTo(x, y);
    this.context.lineTo(x - headLength * Math.cos(angle + Math.PI / 6), y - headLength * Math.sin(angle + Math.PI / 6));
  }
  isCircleAndLineCollided(xc, yc, x1, y1, x2, y2) {
    if ((xc === x1 && yc === y1) || (xc === x2 && yc === y2)) return false;
    if (this.getDistance(x1, y1, x2, y2) < this.getDistance(x1, y1, xc, yc) || this.getDistance(x1, y1, x2, y2) < this.getDistance(x2, y2, xc, yc))
      return false;
    const dotProduct = Math.abs((x1 - xc) * (y2 - yc) - (y1 - yc) * (x2 - xc));
    const distance = dotProduct / this.getDistance(x1, y1, x2, y2);
    return distance < this.nodeRadius;
  }
  isIntersects(x1, y1, x2, y2) {
    for (const node of this.nodes) {
      if (this.isCircleAndLineCollided(node.x, node.y, x1, y1, x2, y2)) {
        return true;
      }
    }
    return false;
  }
  drawCurve(x1, y1, x2, y2, cpx, cpy) {
    this.context.moveTo(x1, y1);
    this.context.bezierCurveTo(cpx, cpy, cpx, cpy, x2, y2);
    this.context.stroke();
  }
  drawEdge(x1, y1, x2, y2, i, j, color = '#f0a911') {
    const headLength = 15; // length of head in pixels
    const dx = x2 - x1;
    const dy = y2 - y1;
    let angle = Math.atan2(dy, dx);
    x1 = x1 + this.nodeRadius * Math.cos(angle);
    y1 = y1 + this.nodeRadius * Math.sin(angle);
    this.context.beginPath();
    this.context.strokeStyle = color;
    this.context.moveTo(x1, y1);
    if (this.graph.isDirected && this.graph.adjacencyMatrix[i][j] === this.graph.adjacencyMatrix[j][i]) {
      const offset = Math.PI / 8;
      x2 = x2 - this.nodeRadius * Math.cos(angle + offset);
      y2 = y2 - this.nodeRadius * Math.sin(angle + offset);
    } else {
      x2 = x2 - this.nodeRadius * Math.cos(angle);
      y2 = y2 - this.nodeRadius * Math.sin(angle);
    }
    if (this.isIntersects(x1, y1, x2, y2)) {
      const cpx = x1 + x2 - this.canvas.width / 2;
      const cpy = y1 + y2 - this.canvas.height / 2;
      this.drawCurve(x1, y1, x2, y2, cpx, cpy);
      angle = Math.atan2(cpy - y2, cpx - x2) + Math.PI;
    } else this.context.lineTo(x2, y2);
    if (this.graph.isDirected) this.drawArrow(x2, y2, angle, headLength, color);
    this.context.stroke();
    this.context.strokeStyle = 'black';
    this.context.closePath();
  }
  drawLoop(x, y, color = '#f0a911') {
    const headLength = 15; // length of head in pixels
    const dx = this.canvas.width / 2 - x;
    const dy = this.canvas.height / 2 - y;
    const angle = Math.atan2(dy, dx);
    const radiusToItself = (this.nodeRadius * 2) / 3;
    const radiusToItselfX = radiusToItself * Math.cos(angle);
    const radiusToItselfY = radiusToItself * Math.sin(angle);
    const offsetX = this.nodeRadius * Math.cos(angle);
    const offsetY = this.nodeRadius * Math.sin(angle);
    this.context.beginPath();
    this.context.strokeStyle = color;
    this.context.arc(x - offsetX - radiusToItselfX, y - offsetY - radiusToItselfY, radiusToItself, 0, Math.PI * 2, false);
    this.context.moveTo(x - offsetX, y - offsetY);
    if (this.graph.isDirected) this.drawArrow(x - offsetX, y - offsetY, angle - Math.PI / 2, headLength, color);
    this.context.stroke();
    this.context.strokeStyle = 'Black';
    this.context.closePath();
  }

  drawNodesTriangle(amount, distanceFromCenter) {
    let angle = 0;
    let counter = 0;
    let edges = 3;
    let k = Math.ceil((amount - 3) / 3) + 1;
    if (amount < edges) edges = amount;
    for (let i = 0; i < edges; i++) {
      const x = this.canvas.width / 2 + distanceFromCenter * Math.cos(angle);
      const y = this.canvas.height / 2 + distanceFromCenter * Math.sin(angle);
      this.nodes[i * k] = { x, y, text: i * k };
      this.drawNode(x, y, 'yellow', i * k);
      angle += (2 * Math.PI) / 3;
    }

    for (let i = 1; i <= edges; i++) {
      counter++;
      let x1 = this.nodes[(i - 1) * k].x;
      let y1 = this.nodes[(i - 1) * k].y;
      let x2 = this.nodes[i * k].x;
      let y2 = this.nodes[i * k].y;
      if (i === 3) {
        x2 = this.nodes[0].x;
        y2 = this.nodes[0].y;
      }
      for (let j = 1; j < k; j++) {
        if (counter === amount) return;
        const x = x1 + (j * (x2 - x1)) / k;
        const y = y1 + (j * (y2 - y1)) / k;
        this.nodes[counter] = { x, y, text: counter };
        this.drawNode(x, y, 'yellow', counter);
        counter++;
      }
    }
    this.context.stroke();
  }
  graphDrawTriangle(distanceFromCenter) {
    this.drawNodesTriangle(this.graph.numberNodes, distanceFromCenter);
    const matrix = this.graph.adjacencyMatrix;
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix.length; j++) {
        if (matrix[i][j] === 1) {
          if (i === j) {
            this.drawLoop(this.nodes[i].x, this.nodes[i].y);
          } else {
            this.drawEdge(this.nodes[i].x, this.nodes[i].y, this.nodes[j].x, this.nodes[j].y, i, j);
          }
        }
      }
    }
  }
}
