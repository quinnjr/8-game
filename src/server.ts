import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import multer from 'multer';
import cors from 'cors';
import * as fs from 'fs';
import { processImageTo8Puzzle } from './server/image-processor';
import { solvePuzzleBFS, solvePuzzleDFS, solvePuzzleIDDFS } from './server/puzzle-solver';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');
const uploadsFolder = resolve(process.cwd(),'public', 'uploads');

if (!fs.existsSync(uploadsFolder)) {
  fs.mkdirSync(uploadsFolder, { recursive: true });
  console.log(`Created uploads directory at ${uploadsFolder}`);
}

const app = express();
const angularApp = new AngularNodeAppEngine();

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, uploadsFolder);
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = file.originalname.split('.').pop();
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'));
    }
    cb(null, true);
  }
});

app.use(cors());

app.use(express.json());

if (!fs.existsSync(uploadsFolder)) {
  fs.mkdirSync(uploadsFolder, { recursive: true });
  console.log(`Created uploads directory at ${uploadsFolder}`);
}

app.post('/api/puzzle/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log(`File uploaded: ${req.file.path}`);

    if (!fs.existsSync(req.file.path)) {
      return res.status(500).json({ error: `File was uploaded but cannot be found at ${req.file.path}` });
    }

    const filePath = req.file.path;
    const pieces = await processImageTo8Puzzle(filePath, uploadsFolder);

    return res.json({
      success: true,
      pieces: pieces,
      original: pieces[0].replace('piece_0.png', 'original.png')
    });
  } catch (error: any) {
    console.error('Error uploading image:', error);
    return res.status(500).json({ error: 'Failed to process image', details: error.message });
  }
});

app.post('/api/puzzle/solve', (req, res) => {
  try {
    const { initialState, goalState, algorithm } = req.body;

    if (!Array.isArray(initialState) || !Array.isArray(goalState)) {
      return res.status(400).json({ error: 'Invalid puzzle state' });
    }

    console.log(`Solving puzzle with ${algorithm} algorithm:`);
    console.log(`Initial state: ${initialState}`);
    console.log(`Goal state: ${goalState}`);

    let solution = null;

    if (algorithm === 'bfs') {
      solution = solvePuzzleBFS(initialState, goalState);
    } else if (algorithm === 'dfs') {
      solution = solvePuzzleDFS(initialState, goalState);
    } else if (algorithm === 'iddfs') {
      solution = solvePuzzleIDDFS(initialState, goalState);
    } else {
      return res.status(400).json({ error: 'Invalid algorithm' });
    }

    // Ensure we always return an array for solution, even if null
    const responseSolution = solution || [];

    return res.json({
      success: true,
      solution: responseSolution,
      solvable: solution !== null
    });
  } catch (error) {
    console.error('Error solving puzzle:', error);
    return res.status(500).json({ error: 'Failed to solve puzzle' });
  }
});

app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

app.use('/public', express.static(resolve(process.cwd(), 'public'), {
  maxAge: '1d',
}));

app.use('/uploads', express.static(uploadsFolder));

app.use('/**', (req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

export const reqHandler = createNodeRequestHandler(app);
