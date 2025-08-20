import { dijkstra, dfs, bfs } from "./algorithms.js";

export const svg = document.getElementById("graph");
const startBox = document.getElementById("startBox");
const endBox = document.getElementById("endBox");
const algoBox = document.getElementById("algoBox");
const calculateBtn = document.getElementById("calculateBtn");
const resetBtn = document.getElementById("resetBtn");
const generateBtn = document.getElementById("generateBtn");

let nodes = [];
let edges = [];
let startNode = null;
let endNode = null;
let selectedAlgo = "dijkstra";

// ------------------ UTILS ------------------
const rand = (min, max) => Math.random() * (max - min) + min;
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

// ------------------ GRAPH GENERATION ------------------
function generateGraph(n, maxEdges) {
  svg.innerHTML = '';
  const nodes = [];
  const es = [];

  for (let i = 0; i < n; i++) {
    nodes.push({
      id: i,
      x: rand(50, 850),
      y: rand(50, 550),
      edges: [],
      connectedEdges: 0,
      el: null
    });
  }

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (
        nodes[i].connectedEdges < maxEdges &&
        nodes[j].connectedEdges < maxEdges &&
        Math.random() < 0.17
      ) {
        const d = Math.round(dist(nodes[i], nodes[j]) / 10);
        const edge = { from: i, to: j, weight: d, el: drawEdge(nodes[i], nodes[j]) };

        nodes[i].edges.push(edge);
        nodes[j].edges.push(edge);
        es.push(edge);

        nodes[i].connectedEdges++;
        nodes[j].connectedEdges++;
      }
    }
  }
  return { nodes, edges: es };
}

// ------------------ DRAW GRAPH ------------------
function drawEdge(from, to) {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", from.x);
  line.setAttribute("y1", from.y);
  line.setAttribute("x2", to.x);
  line.setAttribute("y2", to.y);
  line.setAttribute("class", "edge");

  line.addEventListener("click", () => {
  from.edges = from.edges.filter(edge => edge.el !== line);
  to.edges = to.edges.filter(edge => edge.el !== line);
  edges = edges.filter(edge => edge.el !== line);
  line.remove();
  });

  svg.appendChild(line);
  return line;
}

function drawNodes() {
  nodes.forEach(node => {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", node.x);
    circle.setAttribute("cy", node.y);
    circle.setAttribute("r", 10);
    circle.setAttribute("class", "node");
    node.el = circle;

    circle.addEventListener("click", () => selectNode(node, circle));
    svg.appendChild(circle);
  });
}

// ------------------ RESET GRAPH ------------------
function resetGraph() {
  edges.forEach(edge => edge.el.classList.remove("path", "visited"));
  if (endNode?.el) endNode.el.classList.remove("end");
  if (startNode?.el) startNode.el.classList.remove("start");
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
async function highlightPath(pathEdges) {
  if (!pathEdges || pathEdges.length === 0) {
    alert("Path not found!");
    return;
  }
  
  for (const e of pathEdges) {
    e.el.classList.remove("visited");
    e.el.classList.add("path");
    await delay(30);
  }
}

async function highlightVisiteds(edges) {
  svg.querySelectorAll(".edge").forEach(e => e.classList.remove("path"));
  svg.querySelectorAll(".edge").forEach(e => e.classList.remove("visited"));

  for (const e of edges) {
    e.el.classList.add("visited");
    await delay(115);
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
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

  let result;
  switch (selectedAlgo) {
    case "dijkstra": result = dijkstra(startNode, endNode, nodes, edges); break;
    case "dfs":      result = dfs(startNode, endNode, nodes, edges); break;
    case "bfs":      result = bfs(startNode, endNode, nodes, edges); break;
    default:
      alert(`Algorithm ${selectedAlgo} not implemented yet`);
      return;
  }

  const nodesOfPath = Math.floor(result.path.length - 1, 0);
  updateStats(calcDistance(result.path), nodesOfPath);

  highlightVisiteds(result.visitedEdges)
  .then(() => highlightPath(result.path));

});

resetBtn.addEventListener("click", () => {
  resetGraph();
  startNode = null;
  endNode = null;
  startBox.textContent = "None";
  endBox.textContent = "None";
  updateStats(0, 0);
});

generateBtn.addEventListener("click", () => {
  startNode = null;
  endNode = null;
  startBox.textContent = "None";
  endBox.textContent = "None";

  const nodesCount = +document.getElementById("nodes").value;
  const max = +document.getElementById("maximum-edges").value;
  const { nodes: ns, edges: es } = generateGraph(nodesCount, max);

  nodes = ns;
  edges = es;
  drawNodes();
});

// ------------------ UPDATE STATS ------------------
function updateStats(dist, nodes) {
  document.querySelector('.js-dist').innerHTML = `Distance of path: ${dist}`;
  document.querySelector('.js-nodes').innerHTML = `Nodes of path: ${nodes}`;
}

function calcDistance(path) {
  let result = 0;

  for (const e of path) {
    result += e.weight;
  }

  return result;
}