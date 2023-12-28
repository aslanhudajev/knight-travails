import CreateCell from "./source/cell.js";

const KnightTravails = (function () {
  let cells = [];
  let adjList = new Map();
  //Create all the cells in the chessboard
  for (let r = 0; r < 8; r++) {
    cells.push([]);
    for (let c = 0; c < 8; c++) {
      cells[r].push(CreateCell(r, c));
    }
  }

  //create empty adjList
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      adjList.set(cells[r][c], []);
    }
  }

  //add all edges between cells, to the adj list.
  adjList.forEach((val, cell) => {
    const r = cell.row;
    const c = cell.col;

    //ugly if statements... not sure how to make this cleaner looking, but it works.
    if (typeof cells[r + 1] != "undefined") {
      if (typeof cells[r + 1][c + 2] != "undefined")
        val.push(cells[r + 1][c + 2]);
      if (typeof cells[r + 1][c - 2] != "undefined")
        val.push(cells[r + 1][c - 2]);
    }

    if (typeof cells[r - 1] != "undefined") {
      if (typeof cells[r - 1][c + 2] != "undefined")
        val.push(cells[r - 1][c + 2]);
      if (typeof cells[r - 1][c - 2] != "undefined")
        val.push(cells[r - 1][c - 2]);
    }

    if (typeof cells[r + 2] != "undefined") {
      if (typeof cells[r + 2][c + 1] != "undefined")
        val.push(cells[r + 2][c + 1]);
      if (typeof cells[r + 2][c - 1] != "undefined")
        val.push(cells[r + 2][c - 1]);
    }

    if (typeof cells[r - 2] != "undefined") {
      if (typeof cells[r - 2][c + 1] != "undefined")
        val.push(cells[r - 2][c + 1]);
      if (typeof cells[r - 2][c - 1] != "undefined")
        val.push(cells[r - 2][c - 1]);
    }
  });

  function findShortestPath(start, end) {
    start = cells[start[0]][start[1]];
    end = cells[end[0]][end[1]];

    const prevCells = bfs(start, end);

    const endIndex = prevCells.findIndex((element) => element.cell === end);
    return prevCellsInverseRecursiveTraversal(endIndex, prevCells).reverse();
  }

  function bfs(start, end) {
    let visited = new Set();
    let queue = [start];
    let prevCells = [{ prev: null, cell: start }];
    let prevCellsIndex = 0;

    while (queue.length > 0) {
      const cell = queue.shift();
      const adjCells = adjList.get(cell);

      visited.add(cell);
      if (cell === end) return prevCells;

      for (const adjCell of adjCells) {
        if (!visited.has(adjCell)) {
          prevCells.push({ prev: prevCellsIndex, cell: adjCell });
          queue.push(adjCell);
        }
      }

      prevCellsIndex += 1;
    }
  }

  function prevCellsInverseRecursiveTraversal(endIndex, prevCells) {
    if (prevCells[endIndex].prev === null) return [prevCells[endIndex].cell];
    return [prevCells[endIndex].cell].concat(
      prevCellsInverseRecursiveTraversal(prevCells[endIndex].prev, prevCells),
    );
  }

  function dfs(start, end, visited = new Set()) {
    console.log(start);
    console.log(adjList.get(start));
    visited.add(start);
    const adjCells = adjList.get(start);

    for (const adjCell of adjCells) {
      if (adjCell === end) {
        return visited;
      }

      if (!visited.has(adjCell)) {
        return dfs(adjCell, end, visited);
      }
    }
  }

  return { findShortestPath };
})();

console.log(KnightTravails.findShortestPath([0, 1], [7, 7]));
