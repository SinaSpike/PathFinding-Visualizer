// ------------------ HELPERS ------------------
function buildPath(start, end, parent) {
  const path = [];
  let cur = end.id;

  while (cur !== undefined) {
    path.push(cur);
    if (cur === start.id) break;
    cur = parent[cur];
  }
  
  return path.reverse(); // node ids from start → end
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

  nodes.forEach(n => dist[n.id] = Infinity);
  dist[start.id] = 0;

  const pq = [start];
  while (pq.length) {
    pq.sort((a, b) => dist[a.id] - dist[b.id]);
    const u = pq.shift();

    if (u === end) break;

    for (const e of u.edges) {
      visitedEdges.push(e);
      const v = nodes[e.to];
      const alt = dist[u.id] + e.weight;

      if (alt < dist[v.id]) {
        dist[v.id] = alt;
        parent[v.id] = u.id;
        pq.push(v);
      }
    }
  }

  const path = buildPath(start, end, parent);
  return {path: reconstructEdges(path, edges), visitedEdges};
}

export function dfs(start, end, nodes, edges) {
  const parent = {};
  const visitedNodes = new Set();
  const visitedEdges = [];

  function visit(node) {
    if (node === end) return true;
    visitedNodes.add(node.id);

    for (const e of node.edges) {
      visitedEdges.push(e);
      const neighbor = nodes[e.to];
      if (visitedNodes.has(neighbor.id)) continue;

      parent[neighbor.id] = node.id;
      if (visit(neighbor)) return true;
    }
    return false;
  }

  visit(start);
  const path = buildPath(start, end, parent);
  return {path: reconstructEdges(path, edges), visitedEdges};
}

export function bfs(start, end, nodes, edges) {
  const parent = {};
  const visitedNodes = new Set([start.id]);
  const queue = [start];
  const visitedEdges = [];

  while (queue.length) {
    const node = queue.shift();
    if (node === end) break;

    for (const e of node.edges) {
      visitedEdges.push(e);
      const neighbor = nodes[e.to];
      if (visitedNodes.has(neighbor.id)) continue;

      visitedNodes.add(neighbor.id);
      parent[neighbor.id] = node.id;
      queue.push(neighbor);
    }
  }

  const path = buildPath(start, end, parent);
  return {path: reconstructEdges(path, edges), visitedEdges};
}
