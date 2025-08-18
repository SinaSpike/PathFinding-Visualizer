import { dijkstra } from "./algorithms.js";
const svg = document.getElementById("graph");
const startBox = document.getElementById("startBox");
const endBox = document.getElementById("endBox");
const algoBox = document.getElementById("algoBox");
const calculateBtn = document.getElementById("calculateBtn");
const resetBtn = document.getElementById("resetBtn");

let graph = [];
let edges = [];
let startNode = null;
let endNode = null;
let selectedAlgo = "astar";

// ------------------ GRAPH GENERATION ------------------
function rand(min, max) {
  return Math.random() * (max - min) + min;
}
function dist(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function generateGraph(n = 20) {
  const nodes = [];
  const edges = [];
  for (let i = 0; i < n; i++) {
    nodes.push({
      id: i,
      x: rand(50, 850),
      y: rand(50, 550),
      edges: []
    });
  }

  for (let i = 0; i < n; i++) {
    let connectedCount = 0;
    
    for (let j = i + 1; j < n; j++) {
      if (connectedCount <= 4 && Math.random() < 0.2) {
        connectedCount++;
        const d = Math.round(dist(nodes[i], nodes[j]) / 10);
        nodes[i].edges.push({ to: j, weight: d });
        nodes[j].edges.push({ to: i, weight: d });
        edges.push({ from: i, to: j, weight: d });
      }
    }
  }
  return { nodes, edges };
}

// ------------------ DRAW GRAPH ------------------
function drawGraph() {
  svg.innerHTML = "";
  // draw edges
  edges.forEach(e => {
    const from = graph[e.from];
    const to = graph[e.to];
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", from.x);
    line.setAttribute("y1", from.y);
    line.setAttribute("x2", to.x);
    line.setAttribute("y2", to.y);
    line.setAttribute("class", "edge");
    svg.appendChild(line);
  });

  // draw nodes
  graph.forEach(node => {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", node.x);
    circle.setAttribute("cy", node.y);
    circle.setAttribute("r", 12);
    circle.setAttribute("class", "node");
    circle.addEventListener("click", () => selectNode(node, circle));
    svg.appendChild(circle);
    node.el = circle;
  });
}

// ------------------ NODE SELECTION ------------------
function selectNode(node, el) {
  if (!startNode) {
    startNode = node;
    el.classList.add("start");
    startBox.textContent = node.id;
  } else if (!endNode && node !== startNode) {
    endNode = node;
    el.classList.add("end");
    endBox.textContent = node.id;
  } else if (node === startNode) {
    el.classList.remove("start");
    startNode = null;
    startBox.textContent = "None";
  } else if (node === endNode) {
    el.classList.remove("end");
    endNode = null;
    endBox.textContent = "None";
  }
}

// ------------------ PATH HIGHLIGHT ------------------
function highlightPath(path) {
  svg.querySelectorAll(".edge").forEach(e => e.classList.remove("path"));
  if (!path || path.length < 2) {
    alert("path not found");
  };
  for (let i = 0; i < path.length - 1; i++) {
    const a = path[i], b = path[i + 1];
    const line = [...svg.querySelectorAll("line")].find(l =>
      (l.getAttribute("x1") == graph[a].x && l.getAttribute("y1") == graph[a].y &&
       l.getAttribute("x2") == graph[b].x && l.getAttribute("y2") == graph[b].y) ||
      (l.getAttribute("x1") == graph[b].x && l.getAttribute("y1") == graph[b].y &&
       l.getAttribute("x2") == graph[a].x && l.getAttribute("y2") == graph[a].y));
    if (line) line.classList.add("path");
  }
}

// ------------------ EVENT LISTENERS ------------------
document.querySelectorAll("nav button").forEach(btn => {
  btn.addEventListener("click", () => {
    selectedAlgo = btn.dataset.algo;
    algoBox.textContent = btn.textContent;
  });
});

calculateBtn.addEventListener("click", () => {
  if (!startNode || !endNode) {
    alert("Select start and end nodes first!");
    return;
  }

  let path = [];
    if (selectedAlgo === "dijkstra") {
      path = dijkstra(startNode, endNode, graph);
    } else {
      alert(`Algorithm ${selectedAlgo} not implemented yet`);
      return;
    }

  highlightPath(path);
});

resetBtn.addEventListener("click", () => {
  startNode = null;
  endNode = null;
  startBox.textContent = "None";
  endBox.textContent = "None";
  drawGraph();
});

// ------------------ INIT ------------------
const { nodes, edges: es } = generateGraph();
graph = nodes;
edges = es;
drawGraph();
