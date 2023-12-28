# Knight Travails

An algorithm that describes the shortest path, for a knight, between two squares on a chessboard.
This is achieved using a Graph data structure.

The Graph data structure is represented using an adjacency list.

Here is a slightly more detailed, but still pretty short and consice explanation:

## Data structure

In my solution to this problem I have created two data structures:
The first one is a simple object that represents a cell on the chessboard. Every Cell object has two properties, a row (row) and a column (col).

The second data structure is the actual Graph, represented using an adjacency list.

To simplify the creation of the Graph, I first created a 2D array, containing all cells on an 8x8 chessboard.
Then this 2D array is utilized to create an empty adjacency list:

```javascript
//Create all the cells in the chessboard
let cells = [];
let adjList = new Map();

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
```

The time complexity of this is not very optimal (O(n^2)), but since these doubly-nested for-loops are only used twice, for 64 cells, it should not be an issue. The data can't really "grow".

After the adjacency list has been created, each "key" (vertex in the Graph) get its nodes added programmatically using the following code:

```javascript
adjList.forEach((val, cell) => {
  const r = cell.row;
  const c = cell.col;

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
```

## Shortest path algorithm

In order to find the shortest path between two cells on the chessboard, I created a simple Breadth-First-Search (BFS) algorithm.

The "API" function, used to initialize the BFS is called `findShortestPath()`. The function takes two arrays as arguments, one for the start point and one for the end point.
This function converts the arrays to actual Cell objects and then initializes the BFS using those objects.

The actual BFS function, called `bfs()` then performs a standard BFS, using a Queue, and then returns an array called `prevCells`, which tracks which object each travesed cell "came from".

The `findShortestPath()` then takes this `prevCells` array and calls the `prevCellsInverseRecursiveTraversal()`
function to recursively "back track" in order to find the exact path that was traversed in order to find the optimal path from the start vertex to the end vertex.

```javascript
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
    prevCellsInverseRecursiveTraversal(prevCells[endIndex].prev, prevCells)
  );
}
```

### I hope this helps anyone else taking the Odin Project course.
