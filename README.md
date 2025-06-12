# 8-Puzzle Image Game

An interactive web application that transforms any uploaded image into an 8-puzzle sliding game. This application demonstrates the implementation of search algorithms for puzzle solving with a user interface.

## Features

- **Image Upload**: Upload any image to create a personalized 8-puzzle
- **Responsive UI**: Clean, modern interface that works on various screen sizes
- **Interactive Gameplay**: Drag and drop puzzle pieces with smooth animations
- **Auto-Solve Functionality**: Choose between three solving algorithms:
  - Breadth-First Search (BFS) - Guarantees optimal solution
  - Depth-First Search (DFS) - Simple depth-first search implementation
  - Iterative Deepening DFS (IDDFS) - Combines advantages of BFS and DFS
- **Solution Animation**: Watch the solution play out automatically
- **Statistics**: View the number of moves required to solve the puzzle

## Technologies Used

- **Frontend**:
  - Angular 19+
  - TypeScript
  - TailwindCSS for styling
  - Reactive form handling

- **Backend**:
  - Node.js with Express
  - Server-Side Rendering
  - File upload handling with Multer

- **Image Processing**:
  - Jimp for server-side image manipulation
  - Custom square cropping and piece generation

- **Algorithms**:
  - Breadth-First Search (BFS) implementation (provided by AI)
  - Depth-First Search (DFS) implementation (provided by AI)
  - Iterative Deepening Depth-First Search (IDDFS) implementation (provided by AI)
  - Puzzle solvability verification (provided by AI)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or pnpm package manager (pnpm preferred)

### Installation

1. Install dependencies:
   ```bash
   npm install
   # or using pnpm
   pnpm install
   ```

2. Run the development server:
   ```bash
   npm start
   # or
   pnpm start
   ```

3. Open your browser and navigate to `http://localhost:4200`

4. Installation of pre-requisites:
  ```bash
  ./install.sh

  or

  ./install.bat
  ```

## How It Works

### Puzzle Creation

1. An image is uploaded and processed server-side
2. The image is cropped to a square and divided into a 3×3 grid (8 pieces + empty space)
3. Each piece is saved as a separate image file
4. The frontend receives paths to these images and arranges them in a grid

### Puzzle Solving

The application implements three search algorithms:

- **Breadth-First Search (BFS)**:
  - Explores all possible moves at the current depth before moving deeper
  - Guarantees the shortest possible solution

- **Depth-First Search (DFS)**:
  - Explores as far as possible along each branch before backtracking
  - Uses a stack to track states to explore
  - Has a maximum depth limit to prevent infinite searching

- **Iterative Deepening Depth-First Search (IDDFS)** (AI recommended):
  - IDDFS is a variant of DFS that uses a depth limit to prevent infinite searching
  - Although not part of the original assignment, I elected to keep this implementation as a way to show how DFS can be improved on for puzzle solutions
  - Combines advantages of BFS and DFS
  - Searches to increasing depth limits
  - Finds optimal solutions while being memory-efficient

### BFS

BFS is a graph traversal algoritihim that explors nodes level by level, visting all neighbors of a node on the same level before moving to their neighbors. BFS 'ripples' out for the initial node exploring all nodes first 1 step away, then 2 steps away, etc. BFS uses a Queue DST to keep track of which nodes to visit.

BFS is guartenteed to find the shortest path in an unweighted graph. Time complexity is O(V + E), where V is the number of vertices and E is the number of edges. Space complexity is O(V).

BFS is a good choice for:

- Finding the shortest path between nodes in an unweighted graph
- Level-order tree traversal
- Social network analysis (degress of separation)
- Web crawlers
- Solving puzzles like mazes or sliding puzzeles (like the 8-puzzle)

### DFS

DFS is a graph transversal algorithm that explores as far as possible along a branch before backtracking and exploring other branches. DFS acts like exploring a maze as deep as possible until a dead end is reached, then backtracking to explore other paths. DFS uses a Stack DST or recursion to keep track of which nodes to visit.

DFS is not guarenteed to find the shortest path in an unweighted graph. Time complexity is O(V + E), where V is the number of vertices and E is the number of edges. Space complexity is O(V).

DFS is a good choice for:

- Detecting cycles in graphs
- Topological sorting
- Finding connected components in a graph
- Solveing puzzles like mazes or Sudoku
- Pathinfind when any solution works (not necessarily the shortest)
- Tree transverals (pre-order, post-order, in-order)

### BFS vs DFS

  1. BFS is better for finding the shortest path in an unweighted graph, while DFS is better for finding a path (not necessarily the shortest) in a graph.
  2. DFS is better for memory efficiency when the solution is not necessarily the shortest path and the structure is not narrow (like a Linked List). BFS is better when a shortest path is needed.

### Relation to AI

BFS and DFS are foundational algorithms in AI development, serving as the building blocks for more sophistacated and complicated algorithms.

Search-based AI are core components of AI search strategies. Many AI problems involve searching for the best solution from a set of possible solutions. BFS and DFS provide the most basic traversal algorithms for searching spaces that are common in AI problems.

For example, Decision Trees are a type of AI model that use BFS and DFS to traverse the feature space of a dataset.

### Puzzle Solvability

Not all 8-puzzle configurations are solvable. The application checks solvability by counting inversions:

- Inversions are when a tile with a higher number appears before a tile with a lower number when you read the puzzle left-to-right, top-to-bottom, ignoring the blank space.
- A puzzle is solvable if the number of inversions is even
- The application ensures all generated puzzles are solvable
