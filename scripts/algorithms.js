// ------------------ HELPERS ------------------
function buildPath(start, end, parent) {
  const path = [];
  let cur = end;

  while (cur !== undefined && cur !== null) {
    path.push(cur);
    if (cur === start) break;
    cur = parent[cur];
  }
  
  return path.reverse();
}

function reconstructEdges(path, edges) {
  const pathEdges = [];
  for (let i = 0; i < path.length - 1; i++) {
    const a = path[i], b = path[i + 1];
    const edge = edges.find(
      e => (e.from === a && e.to === b) || (e.from === b && e.to === a)
    );
    if (edge) pathEdges.push(edge);
  }
  return pathEdges;
}

// ------------------ ALGORITHMS ------------------
export function dijkstra(start, end, nodes, edges) {
  const dist = {};
  const parent = {};
  const visitedEdges = [];
  
  const nodeMap = {};
  nodes.forEach(n => {
    nodeMap[n.id] = n;
    dist[n.id] = Infinity;
  });
  
  dist[start.id] = 0;
  const pq = [{id: start.id, dist: 0}];
  
  while (pq.length) {
    pq.sort((a, b) => a.dist - b.dist);
    const {id: currentId} = pq.shift();
    const u = nodeMap[currentId];
    
    if (currentId === end.id) break;
    
    for (const e of u.edges) {
      visitedEdges.push(e);
      const vId = e.to === currentId ? e.from : e.to;
      const v = nodeMap[vId];
      const alt = dist[currentId] + e.weight;
      
      if (alt < dist[vId]) {
        dist[vId] = alt;
        parent[vId] = currentId;
        pq.push({id: vId, dist: alt});
      }
    }
  }
  
  const path = buildPath(start.id, end.id, parent);
  return {path: reconstructEdges(path, edges), visitedEdges};
}

export function dfs(start, end, nodes, edges) {
  const parent = {};
  const visitedNodes = new Set();
  const visitedEdges = [];
  
  const nodeMap = {};
  nodes.forEach(n => nodeMap[n.id] = n);
  
  const stack = [start.id];
  visitedNodes.add(start.id);
  
  while (stack.length) {
    const currentId = stack.pop();
    if (currentId === end.id) break;
    
    const currentNode = nodeMap[currentId];
    
    for (const e of currentNode.edges) {
      visitedEdges.push(e);
      const neighborId = e.to === currentId ? e.from : e.to;
      
      if (!visitedNodes.has(neighborId)) {
        visitedNodes.add(neighborId);
        parent[neighborId] = currentId;
        stack.push(neighborId);
      }
    }
  }
  
  const path = buildPath(start.id, end.id, parent);
  return {path: reconstructEdges(path, edges), visitedEdges};
}

export function bfs(start, end, nodes, edges) {
  const parent = {};
  const visitedNodes = new Set([start.id]);
  const visitedEdges = [];
  
  const nodeMap = {};
  nodes.forEach(n => nodeMap[n.id] = n);
  
  const queue = [start.id];
  
  while (queue.length) {
    const currentId = queue.shift();
    if (currentId === end.id) break;
    
    const currentNode = nodeMap[currentId];
    
    for (const e of currentNode.edges) {
      visitedEdges.push(e);
      const neighborId = e.to === currentId ? e.from : e.to;
      
      if (!visitedNodes.has(neighborId)) {
        visitedNodes.add(neighborId);
        parent[neighborId] = currentId;
        queue.push(neighborId);
      }
    }
  }
  
  const path = buildPath(start.id, end.id, parent);
  return {path: reconstructEdges(path, edges), visitedEdges};
}