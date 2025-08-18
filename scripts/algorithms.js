export function dijkstra(start, end, graph) {
    const distMap = {};
    const parent = {};
    
    graph.forEach(n => distMap[n.id] = Infinity);
    distMap[start.id] = 0;

    const pq = [start];
    while (pq.length) {
        pq.sort((a,b) => distMap[a.id] - distMap[b.id]);
        const u = pq.shift();
        if (u === end) break;

        for (let e of u.edges) {
        const v = graph[e.to];
        
        const alt = distMap[u.id] + e.weight;
        if (alt < distMap[v.id]) {
            distMap[v.id] = alt;
            parent[v.id] = u.id;
            pq.push(v);
        }
        }
    }

    let path = [];
    let cur = end.id;
    while (cur !== undefined) {
        path.push(cur);
        if (cur === start.id) break;
        cur = parent[cur];
    }
    path = path.reverse();

    return path;
}

export function dfs(start, end, graph) {
  const visited = new Set();
  const parent = {};

  function visit(node) {
    if (node === end) return true; // reached destination
    visited.add(node.id);

    for (let e of node.edges) {
      const neighbor = graph[e.to];
      if (!visited.has(neighbor.id)) {
        parent[neighbor.id] = node.id;
        if (visit(neighbor)) return true; // path found
      }
    }
    return false;
  }

  visit(start);

  // Reconstruct path
  const path = [];
  let cur = end.id;
  while (cur !== undefined) {
    path.push(cur);
    if (cur === start.id) break;
    cur = parent[cur];
  }

  return path.reverse();
}